import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Entity('grocery_items')
export class GroceryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @OneToOne(() => Inventory, (inventory) => inventory.item)
  inventory: Inventory;
}
