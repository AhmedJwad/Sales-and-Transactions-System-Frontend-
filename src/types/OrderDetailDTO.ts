export interface OrderDetailDTO {
  productId: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
  colorId?: number;
  sizeId?: number;  
}