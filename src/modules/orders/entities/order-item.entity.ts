import { Order } from './order.entity';
import { GroceryItem } from '../../grocery/entities/grocery-item.entity';

export class OrderItem {
  id: number;
  order: Order;
  item: GroceryItem;
  quantity: number;
  priceAtBooking: number;
}
