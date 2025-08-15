export interface UserDTO{
  id: string;  
  Email: string;
  Username: string;
  FirstName: string;
  LastName: string;
  Address: string;
  CountryCode: string;
  phone: string;
  CityId: number;
  Latitude: number;
  Longitude: number;
  Password: string;
  PasswordConfirm: string;
  Photo:string | null;
}