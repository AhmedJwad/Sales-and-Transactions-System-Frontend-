import { CategoryTranslationDTO } from "./CategoryTranslationDTO";

export interface CategoryDto {
  id: number;
  photo: string | null; 
  categoryTranslations: CategoryTranslationDTO[];
  }