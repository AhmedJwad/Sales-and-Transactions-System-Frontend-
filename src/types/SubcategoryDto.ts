import { CategoryDto } from "./CategoryDto";
import { ProductDTO } from "./ProductDTO";
import { SubcategoryTranslationDTO } from "./SubcategoryTranslationDTO";

export interface SubcategoryDto {
  id: number;
  photo: string | null;
  categoryId: number;
  category?: CategoryDto | null; 
  prosubcategories?: any[] | null; 
  brands?: any[] | null;
  subcategoryTranslations: SubcategoryTranslationDTO[];
  productCategoriesNumber?: number |null;
 products?:ProductDTO[] |null;
}