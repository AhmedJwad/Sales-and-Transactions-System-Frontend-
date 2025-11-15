import { BrandDto } from "./BrandDto";

export interface BrandTranslationDTO {
  id: number;
  brandId: number;
  language: string;
  name: string;
  brand?: BrandDto | null;
}