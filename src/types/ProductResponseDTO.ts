import { ColourDTO } from "./ColoutDTO";
import { productPricesDTO } from "./productPricesDTO";
import { SerialNumberDTO } from "./SerialNumberDTO";
import { SizeDTO } from "./SizeDTO";

export interface ProductResponseDTO {
  id: number;
  barcode: string;
  price: number;
  cost: number;
  profit: number;
  costValue: number;
  priceValue: number;
  realProfit: number;
  desiredProfit: number;
  stock: number;
  hasSerial: boolean;
  createdAt: string;
  productsubCategories: ProductSubCategoryDTO[];
  brandId: number;
  brand: BrandDTO | null;
  productCategoriesNumber: number;
  productImages: ProductImageDTO[];
  productImagesNumber: number;
  mainImage: string;
  serialNumbers: SerialNumberDTO[];
  productColor?: ProductColorDTO[];
  productSize?: ProductSizeDTO[];
  productDiscount?: any;
  rating?: any;
  orderDetail?: any;
  productTranslations: ProductTranslationDTO[];
  productPrices:productPricesDTO[] | null;
}

// ----------------------------
// Category / Subcategory
// ----------------------------
export interface ProductSubCategoryDTO {
  id: number;
  subcategoryId: number;
  category: SubCategoryDTO | null;
  productId: number;
}

export interface SubCategoryDTO {
  id: number;
  photo: string | null;
  categoryId: number;
  category: any;
  prosubcategories: any[];
  brands: any;
  subcategoryTranslations: SubCategoryTranslationDTO[];
  productCategoriesNumber: number;
}

export interface SubCategoryTranslationDTO {
  id: number;
  subcategoryId: number;
  language: string;
  name: string;
}

// ----------------------------
// Brand
// ----------------------------
export interface BrandDTO {
  id: number;
  subcategoryId: number;
  subcategory: any;
  products: any[];
  brandTranslations: BrandTranslationDTO[] | null;
}

export interface BrandTranslationDTO {
  language: string;
  name: string;
}

// ----------------------------
// Images
// ----------------------------
export interface ProductImageDTO {
  id: number;
  productId: number;
  image: string;
  product: any;
  productColorImages: any;
}

// ----------------------------
// Colors
// ----------------------------
export interface ProductColorDTO {
  id: number;
  colorId: number;
  color: ColourDTO ;
  productId: number;
}
 
// ----------------------------
// Sizes
// ----------------------------
export interface ProductSizeDTO {
  id: number;
  sizeId: number;
  size: SizeDTO | null;
  productId: number;
}

// ----------------------------
// Translations
// ----------------------------
export interface ProductTranslationDTO {
  id: number;
  productId: number;
  language: string;
  name: string;
  description: string;
}
