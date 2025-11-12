import { CategoryTranslationDTO } from "./CategoryTranslationDTO";

export interface CategoryDto {
  id: number;
  name?:string | null;
  photo: string | null; 
  categoryTranslations: CategoryTranslationDTO[];
  subcategories?: string[] | null;
  }