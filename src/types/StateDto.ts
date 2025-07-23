import { CityDto } from "./CityDto";
import { CountryDto } from "./CountryDto";

export interface StateDto {
  id: number;
  name: string;
  countryId: number;  
  cities: CityDto[] | null;
  cityNumber: number;
  country:CountryDto;
}