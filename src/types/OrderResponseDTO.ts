import { OrderDetailResponseDTO } from "./OrderDetailResponseDTO";

export interface OrderResponseDTO {
  id: number;
  date: string;
  remarks: string;
  userFullName: string;
  userEmail: string;
  userPhoto: string;
  lines: number;
  quantity: number;
  value: number;
  orderStatus: number;
  phoneNumber: string;
  city:string;
  orderDetailResponseDTOs: OrderDetailResponseDTO[];
}