export interface CategoryProductDto {
  id: number;
  photo: string | null;
  categoryId: number;
  category: string[];   
  products?: any[];     
  subcategoryTranslations?: any; 
}