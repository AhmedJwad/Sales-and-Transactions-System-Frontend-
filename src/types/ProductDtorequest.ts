import { BrandDto } from "./BrandDto";

export interface ProductDtoRequest {
    id: number;  
    name: string;      
    barcode: string;   
    description?: string;   
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
      
  }
  