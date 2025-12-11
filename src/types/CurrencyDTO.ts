export interface CurrencyDTO {
  id: number;
  code: string;
  name: string;
  productPrices: any[] | null;
  exchangeRatesAsBase: any[] | null;
  exchangeRatesAsTarget: any[] | null;
}