import { CategoryDto } from "./CategoryDto";

export interface SubcategoryDto {
    id: number;
    name: string;
    categoryId: number;
    category: CategoryDto | null;
    prosubcategories: any; 
    brands: any;           
    productCategoriesNumber: number;
  }