export interface ProductFilterDto {
  BrandId?: number;      
  ColorIds?: number[];
  SizeIds?: number[];
  MinPrice?: number;
  MaxPrice?: number;
}