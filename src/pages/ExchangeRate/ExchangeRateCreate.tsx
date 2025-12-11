import { FC, useEffect, useState } from "react";
import { ExchangeRateRequestDTO } from "../../types/ExchangeRateRequestDTO";
import genericRepository from "../../repositories/genericRepository";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CurrencyDTO } from "../../types/CurrencyDTO";
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
interface Props{
    onClose: () => void;
}
const ExchangeRateCreate:FC<Props>=({onClose})=>{
     const [loading , setLoading]=useState(false);
     const [exchangeRate, setExchangRate ]=useState<ExchangeRateRequestDTO>({
        baseCurrencyId:0,
        targetCurrencyId:0,
        rate:0,
     });
     const [currency, setCurrency]=useState<CurrencyDTO[]>([]);
    const repository = genericRepository<ExchangeRateRequestDTO[], ExchangeRateRequestDTO>("ExchangeRate/full");
    const repositorycurrency = genericRepository<CurrencyDTO[], CurrencyDTO>("ExchangeRate/combo");
    const validationSchema = Yup.object({
         baseCurrencyId: Yup.number()
                        .required("Base currency is required")
                        .min(1, "Base currency is required"),
        targetCurrencyId: Yup.number()
                        .required("Target currency is required")
                        .min(1, "Target currency is required"),
        rate: Yup.number()
                        .required("Rate is required")
                        .min(0, "Rate must be positive"),
      });
      const formik = useFormik({
          initialValues: exchangeRate,
          validationSchema,
          onSubmit: async (values) => {
            try {                   
                await repository.post(values);              
             onClose();
            } catch (error) {
              console.log(error);
            }
          },
          enableReinitialize: true,
        });
        const getCurrencies = async () => {
              setLoading(true);
            try {
            const result = await repositorycurrency.getAll();
            if (!result.error && result.response) {
                setCurrency(result.response);
            }
            } catch (error) {
            console.log(error);
            } finally {
            setLoading(false);
            }
        };
      useEffect(()=>{
        getCurrencies()
      },[]);
      return (
            <Box component="form" onSubmit={formik.handleSubmit} p={2}>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                {/* Base Currency */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Base Currency</InputLabel>
                    <Select
                    name="baseCurrencyId"
                    value={formik.values.baseCurrencyId}
                    label="Base Currency"
                    onChange={formik.handleChange}
                    error={formik.touched.baseCurrencyId && Boolean(formik.errors.baseCurrencyId)}
                    >
                    {currency.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                        {c.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                {/* Target Currency */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Target Currency</InputLabel>
                    <Select
                    name="targetCurrencyId"
                    value={formik.values.targetCurrencyId}
                    label="Target Currency"
                    onChange={formik.handleChange}
                    error={formik.touched.targetCurrencyId && Boolean(formik.errors.targetCurrencyId)}
                    >
                    {currency.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                        {c.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                {/* Rate */}
                <TextField
                    fullWidth
                    margin="normal"
                    name="rate"
                    label="Rate"
                    type="number"
                    value={formik.values.rate}
                    onChange={formik.handleChange}
                    error={formik.touched.rate && Boolean(formik.errors.rate)}
                    helperText={formik.touched.rate && formik.errors.rate}
                />

                {/* Buttons */}
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                    Cancel
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                    Save
                    </Button>
                </Box>
                </>
            )}
            </Box>
  );     
}

export default ExchangeRateCreate