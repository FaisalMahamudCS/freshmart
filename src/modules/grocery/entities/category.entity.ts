import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroceryItem } from './grocery-item.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => GroceryItem, (item) => item.category)
  items: GroceryItem[];
}
