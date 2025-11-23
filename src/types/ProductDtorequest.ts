import { BrandDto } from "./BrandDto";
import { ProductionTranslationsDTO } from "./ProductionTranslationsDTO";

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
    Name: string;
    Description: string;

      
  }
  