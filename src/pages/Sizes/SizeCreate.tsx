import { FC, useEffect, useState } from "react";
import genericRepository from "../../repositories/genericRepository";
import { SizeDTO } from "../../types/SizeDTO";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";

interface props {
    id?:number | null;
    onClose:()=>void;
}

const SizeCreate:FC<props>=({id, onClose})=>{
    const numericId=Number(id);
    const [loading, setLoading]=useState(false);
    const [initialValues, setInitialValues]=useState({
        name:"",
    })
    const repository=genericRepository<SizeDTO[], SizeDTO>("sizes");
    const getsizebyId=async()=>{
        try {
            setLoading(true);
            const result=await repository.getOne(numericId);
            if(!result.error && result.response) 
            {
                setInitialValues({
                    name:result.response.name,
                });                
            }else
            {
                 console.log("Error fetch colorId:", result.message);                
            }           
        } catch (error:any) {
            console.error("Unexpected error:", error.message || error);
        }finally
        {
            setLoading(false)
        }
    }
     const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),        
      });
       const formik = useFormik({
          initialValues,
          validationSchema,
          onSubmit: async (values) => {
            try {
              if (numericId) {
                await repository.put({ ...values, id: numericId });
              } else {
                await repository.post(values);
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
        useEffect(()=>{
            if(id)
            {
                getsizebyId()
            }else
            {
               setInitialValues({name:""})
            }
        },[id])
         return (
            <Box>
                {loading ? (
                    <LoadingComponent />
                ) : (
                    <form onSubmit={formik.handleSubmit}>                   
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>           
                        <Grid size={{xs:12}} >
                        <TextField
                            id="name"
                            name="name"
                            fullWidth
                            label="Size Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}                           
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            size="small"
                        />
                        </Grid>
                       
                        <Grid size={{xs:12}}>
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

export default SizeCreate;