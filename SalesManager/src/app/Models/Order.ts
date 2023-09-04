import { OrderLineItem } from "./OrderLineItem";

export class Order {
  id?: number;
  accountId: number = 0;
  subtotal: number = 0;
  taxes: number = 7;
  total: number = 0;
  OrderLineItems: OrderLineItem[] = [];
}
