import { BrandDto } from "./BrandDto";
import { ProductImageDTO } from "./ProductImageDTO";
import { ProductSubCategoryDTO } from "./ProductSubCategoryDTO";
import { SerialNumberDTO } from "./SerialNumberDTO";


export interface ProductDTO {
  id: number;
  name: string;
  barcode: string;
  description: string;
  price: number;
  cost: number;
  profit: number;
  costValue: number;
  priceValue: number;
  realProfit: number;
  desiredProfit: number;
  stock: number;
  hasSerial: boolean;
  productsubCategories:ProductSubCategoryDTO[]; 
  brandId: number;
  brand:BrandDto;
  productCategoriesNumber: number;
  productImages: ProductImageDTO[];
  productImagesNumber: number;
  mainImage: string;
  serialNumbers:SerialNumberDTO[];
  }