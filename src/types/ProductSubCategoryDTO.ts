import { SubcategoryDto } from "./SubcategoryDto";


export interface ProductSubCategoryDTO {
    id: number;
    subcategoryId: number;
    subcategory: SubcategoryDto;
    productId: number;
  }