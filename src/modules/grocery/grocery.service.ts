import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateGroceryItemDto } from './dto/create-grocery-item.dto';
import { UpdateGroceryItemDto } from './dto/update-grocery-item.dto';

@Injectable()
export class GroceryService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Category Operations ---
  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Category already exists');
    }

    return this.prisma.category.create({
      data: { name: dto.name },
    });
  }

  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  // --- Grocery Item Operations ---
  async createItem(dto: CreateGroceryItemDto) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Create item and initialize inventory
    return this.prisma.groceryItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        inventory: {
          create: { stockLevel: dto.initialStock || 0 },
        },
      },
      include: {
        inventory: true,
        category: true,
      },
    });
  }

  async getAllItemsForUser() {
    // Only items with stock > 0 for users (Simplified logic)
    return this.prisma.groceryItem.findMany({
      where: {
        inventory: {
          stockLevel: { gt: 0 },
        },
      },
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async getAllItemsForAdmin() {
    return this.prisma.groceryItem.findMany({
      include: {
        category: true,
        inventory: true,
      },
    });
  }

  async updateItem(id: number, dto: UpdateGroceryItemDto) {
    const item = await this.prisma.groceryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    return this.prisma.groceryItem.update({
      where: { id },
      data: dto,
      include: { inventory: true, category: true },
    });
  }

  async deleteItem(id: number) {
    const item = await this.prisma.groceryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    // Due to relations, we might need to delete inventory first or use cascade
    // In our schema, we'll handle it via prisma's delete
    await this.prisma.inventory.deleteMany({ where: { groceryItemId: id } });
    return this.prisma.groceryItem.delete({ where: { id } });
  }

  async updateStock(id: number, stockLevel: number) {
    return this.prisma.inventory.update({
      where: { groceryItemId: id },
      data: { stockLevel },
    });
  }
}
