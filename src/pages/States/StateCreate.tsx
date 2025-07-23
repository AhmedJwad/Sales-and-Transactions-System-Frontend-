import { FC, useEffect, useState } from "react";
import { CountryDto } from "../../types/CountryDto";
import genericRepository from "../../repositories/genericRepository";
import { StateDto } from "../../types/StateDto";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";

 interface  Props {
    id?:number | null,
    onClose:()=>void,
 }

 const StateCreate:FC<Props>=({id , onClose})=>{
    const numericId=Number(id);
    const [countries, setCountries]=useState<CountryDto[]>([]);
    const [loading, setLoading]=useState(false);
    const [initialValues, setInitialValues]=useState({
        name:"",
        countryId:0,
        cityNumber:0,
    });
    const CountryRepo=genericRepository<CountryDto[], CountryDto>("Countries/combo")
    const StateRepo = genericRepository<StateDto[], StateDto>("State");
    const FetchCountries=async()=>{
        try {
            setLoading(true);
        const result=await CountryRepo.getAll();
        if(!result.error && result.response)
        {
            setCountries(result.response);
        }else
        {
            console.log("error fetch  countries:", result.error)            
        }            
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }
    const getStateById = async () => {
      setLoading(true);
      try {
        const result = await StateRepo.getOne(numericId);
        if (!result.error && result.response) {
          setInitialValues({
            name: result.response.name,
            countryId: result.response.countryId,
            cityNumber:result.response.cityNumber,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
     useEffect(() => {
          FetchCountries();
          if (id) {
           getStateById();
          } else {
            setInitialValues({ name: "", countryId: 0 , cityNumber:0});
          }
        }, [id]);
      
        const validationSchema = Yup.object({
          name: Yup.string().required("Name is required"),
          countryId: Yup.number()
            .required("Country is required")
            .min(1, "Please select a country"),
        });
      
        const formik = useFormik({
          initialValues,
          validationSchema,
          onSubmit: async (values) => {
            try {
              if (numericId) {
                await StateRepo.put({ ...values, id: numericId });
              } else {
                await StateRepo.post(values);
                console.log(values);
              }
              onClose();
            } catch (error) {
              console.log(error);
            }
          },
          validateOnBlur: false,
          validateOnMount: true,
          enableReinitialize: true,
        });
         return (
              <Box>
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <form onSubmit={formik.handleSubmit}>
                    <Typography variant="h6">                    
                    </Typography>
                    <Divider sx={{ my: 2 }} />
          
                    <Grid container spacing={2}>
                      <Grid>
                        <TextField
                          id="name"
                          name="name"
                          fullWidth
                          label="State Name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          error={formik.touched.name && Boolean(formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
                          size="small"
                        />
                      </Grid>
          
                      <Grid>
                        <TextField
                          select
                          id="countryId"
                          name="countryId"
                          label="Country"
                          fullWidth
                          value={formik.values.countryId}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.countryId &&
                            Boolean(formik.errors.countryId)
                          }
                          helperText={
                            formik.touched.countryId && formik.errors.countryId
                          }
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
          
                      <Grid>
                        <Button type="submit" variant="contained" color="primary">
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Box>
            );
 }

 export default StateCreate;