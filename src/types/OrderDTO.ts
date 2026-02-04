import { OrderDetailDTO } from "./OrderDetailDTO";

export interface OrderDTO {
  remarks?: string;
  orderStatus: number;
  orderDetails: OrderDetailDTO[];
  currency: string; 

}