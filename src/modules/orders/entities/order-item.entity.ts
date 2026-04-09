import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { GroceryItem } from '../../grocery/entities/grocery-item.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => GroceryItem)
  item: GroceryItem;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtBooking: number;
}
