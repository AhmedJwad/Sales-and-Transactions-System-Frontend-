import { ProductDiscountDto } from "./ProductDiscountDto";

export interface DiscountDto {
  id: number;
  discountPercent: number;
  startTime: string;
  endtime: string;
  isActive: boolean;
  productDiscounts: ProductDiscountDto[];
}