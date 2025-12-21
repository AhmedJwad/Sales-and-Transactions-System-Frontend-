import { DiscountDto } from "./DiscountDto";
import { ProductDTO } from "./ProductDTO";
import { ProductResponseDTO } from "./ProductResponseDTO";

export interface ProductDiscountDto {
  id: number;
  discountId: number;
  discount?: DiscountDto | null;
  productID: number;
  product?: ProductResponseDTO | null;
}