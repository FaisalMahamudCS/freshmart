import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    // Check if item exists and has stock
    const item = await this.prisma.groceryItem.findUnique({
      where: { id: dto.groceryItemId },
      include: { inventory: true },
    });

    if (!item) throw new NotFoundException('Item not found');
    if (!item.inventory || item.inventory.stockLevel < dto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Check if already in cart
    const existing = await this.prisma.cartItem.findFirst({
      where: { userId, groceryItemId: dto.groceryItemId },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        groceryItemId: dto.groceryItemId,
        quantity: dto.quantity,
      },
    });
  }

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        item: {
          include: { category: true,inventory:true },
        },
      },
    });
  }

  async updateQuantity(userId: string, cartItemId: number, quantity: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      return this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({ where: { userId } });
  }

  async removeFromCart(userId: string, cartItemId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }
}
