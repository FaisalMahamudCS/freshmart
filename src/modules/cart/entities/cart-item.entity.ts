import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GroceryItem } from '../../grocery/entities/grocery-item.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => GroceryItem)
  item: GroceryItem;

  @Column({ default: 1 })
  quantity: number;
}
