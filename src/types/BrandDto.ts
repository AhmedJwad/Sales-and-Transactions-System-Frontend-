import { SubcategoryDto } from "./SubcategoryDto";


export interface BrandDto{
    id:number,
    name:string,
    subcategoryId:number,
    subcategory:SubcategoryDto | null,
    products: any;
}