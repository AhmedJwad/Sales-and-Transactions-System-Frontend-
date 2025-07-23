import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { CountryDto } from "../../types/CountryDto";
import genericRepository from "../../repositories/genericRepository";
import { useFormik } from "formik";
import { Box, Button, Divider, Grid, TextField } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";

interface props{
    id?:number | null;
    onClose:()=>void;
}

const CountryCreate:FC<props>=({id, onClose})=>{
    const numericId=Number(id);
    const [loading, setLoading]=useState(false);   
    const [country, setcountry]=useState<CountryDto>({id:0 , name:"", states:null, statesNumber:0});
    const repository=genericRepository<CountryDto[],CountryDto>("Countries");
    const validationSchema = Yup.object({
        name: Yup.string().required("requiredField"),
      });
    
    const getCountryById=async()=>{
        setLoading(true);
        try {
            const result=await repository.getOne(numericId);
            if(!result.error && result.response)
            {
                setcountry({
                    id:result.response.id,
                    name:result.response.name,
                    statesNumber:result.response.statesNumber,
                    states:null,
                })
            }else{
                console.log("Error fetch countries:", result.error);                
            }            
        } catch (error) {
            console.log(error);
        }finally{
             setLoading(false)
        }         
    }
    useEffect(()=>{
        if(id)
        {
            getCountryById();
        }
        else
        {
            setcountry({id:0, name:"", states:null , statesNumber:0})
        }
    },[id]);
   const formik=useFormik({
    initialValues:country,
    validationSchema,
    onSubmit:async(values)=>{
        try {
            if(numericId)
            {
                await repository.put({...values, id:numericId})
            }else
            {
                await repository.post(values)              
            }
            onClose();
        } catch (error) {
             console.log(error);
        }
    },    
    validateOnBlur:false,
     validateOnMount: true,
    enableReinitialize: true,
   });
   return(
    <Box>
       {loading ? (<LoadingComponent/>):(
       <form onSubmit={formik.handleSubmit}>
         <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid>
              <TextField
                id="name"
                name="name"
                size="small"
                fullWidth
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid>
              <Button type="submit" variant="outlined">
                Save
              </Button>
            </Grid>
          </Grid>
       </form>
       )}
    </Box>
   )

}
export default CountryCreate