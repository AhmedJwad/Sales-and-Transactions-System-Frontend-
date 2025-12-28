export type CurrencyCode = "USD" | "IQ" ;

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}