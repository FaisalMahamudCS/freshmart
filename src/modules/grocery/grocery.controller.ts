import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
import { UpdateGroceryItemDto } from './dto/update-grocery-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Grocery Catalog')
@Controller('grocery')
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  // --- Public / User Endpoints ---
  @Get('items')
  @ApiOperation({ summary: 'Get all available grocery items (User)' })
  findAllForUser() {
    return this.groceryService.getAllItemsForUser();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  findCategories() {
    return this.groceryService.getAllCategories();
  }

  // --- Admin Endpoints ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/items')
  @ApiOperation({ summary: 'Get all grocery items (Admin)' })
  findAllForAdmin() {
    return this.groceryService.getAllItemsForAdmin();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/categories')
  @ApiOperation({ summary: 'Create a new category (Admin)' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.groceryService.createCategory(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/items')
  @ApiOperation({ summary: 'Create a new grocery item (Admin)' })
  createItem(@Body() dto: CreateGroceryItemDto) {
    return this.groceryService.createItem(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/items/:id')
  @ApiOperation({ summary: 'Update a grocery item (Admin)' })
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGroceryItemDto) {
    return this.groceryService.updateItem(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/items/:id')
  @ApiOperation({ summary: 'Delete a grocery item (Admin)' })
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.groceryService.deleteItem(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/items/:id/stock')
  @ApiOperation({ summary: 'Update stock level (Admin)' })
  updateStock(@Param('id', ParseIntPipe) id: number, @Body('stockLevel', ParseIntPipe) stockLevel: number) {
    return this.groceryService.updateStock(id, stockLevel);
  }
}
