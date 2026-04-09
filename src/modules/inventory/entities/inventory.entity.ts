import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { GroceryItem } from '../../grocery/entities/grocery-item.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  stockLevel: number;

  @OneToOne(() => GroceryItem, (item) => item.inventory)
  @JoinColumn({ name: 'grocery_item_id' })
  item: GroceryItem;
}
