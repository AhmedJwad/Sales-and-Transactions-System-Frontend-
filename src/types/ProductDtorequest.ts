import { BrandDto } from "./BrandDto";
import { CategoryProductDto } from "./CategoryProductDto";
import { ColourDTO } from "./ColoutDTO";
import { ProductionTranslationsDTO } from "./ProductionTranslationsDTO";
import { SizeDTO } from "./SizeDTO";
import { SubcategoryDto } from "./SubcategoryDto";


export interface ProductDtoRequest {
    id: number; 
    barcode: string;  
    price: number;     
    cost: number;   
    desiredProfit: number; 
    stock: number;   
    brandId: number;  
    hasSerial: boolean;  
    productCategoryIds?: number[];
    ProductColorIds?: number[]; 
    ProductSizeIds?:number[];  
    productImages?: string[];        
    serialNumbers?: string[];
    BrandId?:number; 
    productionTranslations:ProductionTranslationsDTO[];   
    name: string;
    description: string; 
  }
  