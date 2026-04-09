import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout current cart and place order' })
  checkout(@Req() req: any) {
    return this.ordersService.checkout(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user orders' })
  getOrders(@Req() req: any) {
    return this.ordersService.getUserOrders(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }
}
