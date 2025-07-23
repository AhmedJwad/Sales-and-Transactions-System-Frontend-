import { StateDto } from "./StateDto";

export interface CityDto {
  id: number;
  name: string;
  stateId: number;  
  state:StateDto|null;
  users: any[] | null;
}