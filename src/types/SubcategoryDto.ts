import { CategoryDto } from "./CategoryDto";

export interface SubcategoryDto {
    id: number;
    name: string;
    categoryId: number;
    category: CategoryDto | null;
    prosubcategories: any; // يمكن تخصيصها لاحقًا
    brands: any;           // يمكن تخصيصها لاحقًا
    productCategoriesNumber: number;
  }