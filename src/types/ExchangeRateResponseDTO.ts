import { CurrencyDTO } from "./CurrencyDTO";

export interface ExchangeRateResponseDTO {
  id: number;
  baseCurrencyId: number;
  baseCurrency: CurrencyDTO;
  targetCurrencyId: number;
  targetCurrency: CurrencyDTO;
  rate: number;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  updatedAt: string;
}