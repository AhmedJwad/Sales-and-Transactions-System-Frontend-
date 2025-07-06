import { FC, useEffect, useState } from "react";
import genericRepository from "../../repositories/genericRepository";
import { BrandDto } from "../../types/BrandDto";
import { SubcategoryDto } from "../../types/SubcategoryDto";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";

interface props {
    id?:number | null;
    onClose:()=>void;
}


const BrandCreate:FC<props>=({id, onClose})=>{

    const numericId = Number(id);
    const [subcategories, setsubcategories]=useState<SubcategoryDto[]>([]);
    const [brands, setbrands]=useState<BrandDto[]>([]);
    const [loading , setloading ]=useState(false);
    const [initialValues, setinitialValues]=useState({
        name:"",
        subcategoryId:0,        
    })
    const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory");
    const brandRepo=genericRepository<BrandDto[], BrandDto>("Brand");

    const fetchsubcategories=async()=>{
        setloading(true)
        try {
            const result=await subcategoryRepo.getAll();
            if(!result.error && result.response)
            {
                setsubcategories(result.response)

            }
            else
            {
                console.error("Error fetching subcategories:", result.message);
            }
        } catch (error:any) {
            console.error("Unexpected error:", error.message || error);  
        }finally{
            setloading(false)
        }
    }
    const getBrandbyId=async()=>{
        setloading(true);
        try {
            const result=await brandRepo.getOne(numericId);
            if(!result.error && result.response)
            {
                setinitialValues({
                    name:result.response.name,
                    subcategoryId:result.response.subcategoryId,
                });
            } else{
                console.error("Error fetching brand by Id " , result.message)
            }           
        } catch (error:any) {
           console.error("Unexpected error:", error.message || error);                        
        }finally{
            setloading(false)
        }
    }
    useEffect(()=>{
        fetchsubcategories();
        if(id)
        {
            getBrandbyId()
        }else{
            setinitialValues({name:"" , subcategoryId:0})
        }
    },[id])

    const validationSchema=Yup.object({
        name:Yup.string().required("name is required"),
        subcategoryId:Yup.number()
        .required("Subcategory is required")
        .min(1,"please select a subcategory")       
    })

    const formik=useFormik({
        initialValues,
        validationSchema,
        onSubmit:async(values)=>{
            try {
                if(numericId) 
                {
                    await brandRepo.put( {... values , id:numericId});
                }else {
                    await brandRepo.post(values)
                }
                onClose();               
            } catch (error) {
                console.log(error);
            }
        },
        validateOnBlur:false,
        validateOnMount:true,
        enableReinitialize:true,
    });
    return( 
        <Box>{loading ? <LoadingComponent/>:(
           <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6">              
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
             <TextField
             id="name"
             name="name"
             fullWidth
             label="Brand Name"
             value={formik.values.name}
             onChange={formik.handleChange}
             error={formik.touched.name && Boolean(formik.errors.name)}
             helperText={formik.touched.name && formik.errors.name}
             size="small"
             />
            <Grid>
                <TextField
                  select
                  id="subcategoryId"
                  name="subcategoryId"
                  label="subcategory"
                  fullWidth
                  value={formik.values.subcategoryId}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subcategoryId &&
                    Boolean(formik.errors.subcategoryId)
                  }
                  helperText={
                    formik.touched.subcategoryId && formik.errors.subcategoryId
                  }
                  size="small"
                >
                  <MenuItem value={0} disabled>
                    -- Select a category --
                  </MenuItem>
                  {subcategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
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
    )    
}

export default BrandCreate;