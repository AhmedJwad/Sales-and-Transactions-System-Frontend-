import { BrandDto } from "./BrandDto";
import { CategoryDto } from "./CategoryDto";
import { CategoryProductDto } from "./CategoryProductDto";
import { ColourDTO } from "./ColoutDTO";
import { productColorDTO } from "./productColorDTO";
import { ProductImageDTO } from "./ProductImageDTO";
import { ProductionTranslationsDTO } from "./ProductionTranslationsDTO";
import { ProductSizeDTO } from "./ProductSizeDTO";
import { ProductSubCategoryDTO } from "./ProductSubCategoryDTO";
import { SerialNumberDTO } from "./SerialNumberDTO";
import { SizeDTO } from "./SizeDTO";


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
  categories:CategoryProductDto[];   
  colors:ColourDTO[];  
  sizes:SizeDTO[];
  brandId: number;
  brand:BrandDto;
  productCategoriesNumber: number;
  productImages: ProductImageDTO[];
  productImagesNumber: number;
  mainImage: string;
  serialNumbers:SerialNumberDTO[];
  productionTranslations:ProductionTranslationsDTO[] |null;
  oldPrice:number;
  discountPercent :number;
  
  }