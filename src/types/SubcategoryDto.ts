import { CategoryDto } from "./CategoryDto";
import { ProductDTO } from "./ProductDTO";

export interface SubcategoryDto {
    id: number;
    name: string;
    categoryId: number;
    category: CategoryDto | null;
    prosubcategories: any; 
    brands: any;           
    productCategoriesNumber: number;
    photo:string|null;
    products:ProductDTO[] |null;
  }