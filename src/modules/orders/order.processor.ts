import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('order-queue')
export class OrderProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { orderId } = job.data;
    this.logger.log(`Processing order: ${orderId}`);

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Get order details
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order || order.status !== 'PENDING') {
          return;
        }

        // 2. Validate and Update stock
        for (const item of order.items) {
          const inventory = await tx.inventory.findUnique({
            where: { groceryItemId: item.groceryItemId },
          });

          if (!inventory || inventory.stockLevel < item.quantity) {
            throw new Error(`Insufficient stock for item id: ${item.groceryItemId}`);
          }

          await tx.inventory.update({
            where: { groceryItemId: item.groceryItemId },
            data: { stockLevel: inventory.stockLevel - item.quantity },
          });
        }

        // 3. Mark order as COMPLETED
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'COMPLETED' },
        });
      });

      this.logger.log(`Order ${orderId} successfully processed.`);
    } catch (error) {
      this.logger.error(`Order ${orderId} failed: ${error.message}`);
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILED' },
      });
    }
  }
}
