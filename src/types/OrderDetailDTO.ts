export interface OrderDetailDTO {
  ProductId: number;
  Name: string;
  Description: string;
  Image: string;
  Price: number;
  Quantity: number;
  Remarks?: string;
}