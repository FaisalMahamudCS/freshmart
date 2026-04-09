import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CartModule } from '../cart/cart.module';
import { BullModule } from '@nestjs/bullmq';
import { OrderProcessor } from './order.processor';

@Module({
  imports: [
    PrismaModule,
    CartModule,
    BullModule.registerQueue({
      name: 'order-queue',
    }),
  ],
  providers: [OrdersService, OrderProcessor],
  controllers: [OrdersController],
})
export class OrdersModule {}
