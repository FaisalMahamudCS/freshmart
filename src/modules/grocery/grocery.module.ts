import { Module } from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { GroceryController } from './grocery.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GroceryService],
  controllers: [GroceryController],
  exports: [GroceryService],
})
export class GroceryModule {}
