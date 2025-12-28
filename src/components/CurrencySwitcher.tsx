// src/components/CurrencySwitcher.tsx
import { useCurrency } from "../context/CurrencyContext";
import { currencies } from "../types/currencies";
import { CurrencyCode } from "../types/Currency";

const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CurrencyCode);
  };

  return (
    <select value={currency} onChange={handleChange}>
      {currencies.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} ({c.symbol})
        </option>
      ))}
    </select>
  );
};

export default CurrencySwitcher;
