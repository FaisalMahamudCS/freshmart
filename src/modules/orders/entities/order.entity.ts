export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export class Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
}
