import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    @InjectQueue('order-queue') private readonly orderQueue: Queue,
  ) {}

  async checkout(userId: string) {
    const cartItems = await this.cartService.getCart(userId);

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate total price and validate stock locally (pre-check)
    let totalPrice = 0;
    for (const item of cartItems) {
      const groceryItem = item.item as any;
      if (!groceryItem.inventory || groceryItem.inventory.stockLevel < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${groceryItem.name}`);
      }
      totalPrice += Number(groceryItem.price) * item.quantity;
    }

    // Create order in PENDING status
    const order = await this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: 'PENDING',
        items: {
          create: cartItems.map((item) => ({
            groceryItemId: item.groceryItemId,
            quantity: item.quantity,
            priceAtBooking: item.item.price,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart
    await this.cartService.clearCart(userId);

    // Add to processing queue
    await this.orderQueue.add('process-order', { orderId: order.id });

    return order;
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { item: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { item: true } } },
    });
  }
}
