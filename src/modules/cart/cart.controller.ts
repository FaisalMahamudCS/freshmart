import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'View current cart' })
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateQuantity(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(req.user.id, id, quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from cart' })
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  clear(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
