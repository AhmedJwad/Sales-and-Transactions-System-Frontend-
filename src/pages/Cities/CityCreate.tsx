import { FC, useEffect, useState } from "react";
import { StateDto } from "../../types/StateDto";
import { CountryDto } from "../../types/CountryDto";
import genericRepository from "../../repositories/genericRepository";
import { CityDto } from "../../types/CityDto";
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Props {
  id?: number | null;
  onClose: () => void;
}

const CityCreate: FC<Props> = ({ id, onClose }) => {
  const numericId = Number(id);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [states, setStates] = useState<StateDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    countryId: 0,
    stateId: 0,
  });

  const CountryRepo = genericRepository<CountryDto[], CountryDto>("Countries/combo");
  const CityRepo = genericRepository<CityDto[], CityDto>("cities");

  
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const result = await CountryRepo.getAll();
      if (!result.error && result.response) {
        setCountries(result.response);
      } else {
        console.error("Error fetching countries:", result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchStatesByCountry = async (countryId: number) => {
    try {
      setLoading(true);
      const result = await genericRepository<StateDto[], StateDto>(`State/combo/${countryId}`).getAll();
      if (!result.error && result.response) {
        setStates(result.response);
      } else {
        console.error("Error fetching states:", result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCityById = async () => {
    try {
      setLoading(true);
      const result = await CityRepo.getOne(numericId);
      if (!result.error && result.response) {
        const stateId = result.response.stateId;
        const stateResult = await genericRepository<StateDto, StateDto>("State").getOne(stateId);
        if (!stateResult.error && stateResult.response) {
          const countryId = stateResult.response.countryId;
          setInitialValues({
            name: result.response.name,
            stateId,
            countryId,
          });
          await fetchStatesByCountry(countryId);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchCountries();
    if (id) {
      getCityById();
    } else {
      setInitialValues({ name: "", countryId: 0, stateId: 0 });
    }
  }, [id]);

  
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    countryId: Yup.number().required("Country is required").min(1, "Please select a country"),
    stateId: Yup.number().required("State is required").min(1, "Please select a state"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (numericId) {
          await CityRepo.put({ ...values, id: numericId });
        } else {
          await CityRepo.post(values);
        }
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    validateOnBlur: false,
    validateOnMount: true,
    enableReinitialize: true,
  });

  
  const handleCountryChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCountryId = Number(event.target.value);
    formik.setFieldValue("countryId", selectedCountryId);
    formik.setFieldValue("stateId", 0);
    await fetchStatesByCountry(selectedCountryId);
  };

  return (
    <Box>
      {loading ? (
        <LoadingComponent />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6"></Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            {/* Country Dropdown */}
            <Grid sx={{ justifyContent: "space-between", px: 2 }}>
              <TextField
                select
                id="countryId"
                name="countryId"
                label="Country"
                fullWidth
                value={formik.values.countryId}
                onChange={handleCountryChange}
                error={formik.touched.countryId && Boolean(formik.errors.countryId)}
                helperText={formik.touched.countryId && formik.errors.countryId}
                size="small"
              >
                <MenuItem value={0} disabled>
                  -- Select a Country --
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* State Dropdown */}
            <Grid sx={{ justifyContent: "space-between", px: 2 }}>
              <TextField
                select
                id="stateId"
                name="stateId"
                label="State"
                fullWidth
                value={formik.values.stateId}
                onChange={formik.handleChange}
                error={formik.touched.stateId && Boolean(formik.errors.stateId)}
                helperText={formik.touched.stateId && formik.errors.stateId}
                size="small"
                disabled={formik.values.countryId === 0}
              >
                <MenuItem value={0} disabled>
                  -- Select a State --
                </MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* City Name */}
            <Grid sx={{ justifyContent: "space-between", px: 2 }}>
              <TextField
                id="name"
                name="name"
                fullWidth
                label="City Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </Grid>

            {/* Submit Button */}
            <Grid sx={{ justifyContent: "space-between", px: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default CityCreate;
