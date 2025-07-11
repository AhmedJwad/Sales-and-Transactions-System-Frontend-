
export interface ProductDTO {
  id: number;
  name: string;
  barcode: string;
  description: string;
  price: number;
  cost: number;
  desiredProfit: number;
  stock: number;
  hasSerial: boolean;
  brand: string; 
  subcategories: string[]; 
  categories: string[]; 
  serialCount: number; 
  productImagesNumber: number; 
  image:string;
  }