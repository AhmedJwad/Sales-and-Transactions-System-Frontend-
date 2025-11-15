import { BrandTranslationDTO } from "./BrandTranslationDTO";
import { SubcategoryDto } from "./SubcategoryDto";


export interface BrandDto{
    id:number,  
    subcategoryId:number,
    subcategory?:SubcategoryDto | null,
    products?: any | null;
    brandTranslations: BrandTranslationDTO[];
}