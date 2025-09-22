import { OrderDetailDTO } from "./OrderDetailDTO";

export interface OrderDTO {
  Remarks?: string;
  OrderStatus: number; // 0 = New
  OrderDetails: OrderDetailDTO[];
}