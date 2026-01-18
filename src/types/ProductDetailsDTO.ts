import { BrandDto } from "./BrandDto";
import { ColourDTO } from "./ColoutDTO";
import { ProductDTO } from "./ProductDTO";
import { SizeDTO } from "./SizeDTO";
import { SubcategoryDto } from "./SubcategoryDto";

export interface ProductDetailsDTO {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  oldPrice: number;
  discountPercent: number;
  images: string[];
  brand: BrandDto | null;
  colors: ColourDTO[];
  sizes: SizeDTO[];
  categories: SubcategoryDto[];
  relatedProducts: ProductDTO[];
}
