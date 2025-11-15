import { FC, useEffect, useState } from "react";
import genericRepository from "../../repositories/genericRepository";
import { BrandDto } from "../../types/BrandDto";
import { SubcategoryDto } from "../../types/SubcategoryDto";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import { useTranslation } from "react-i18next";

interface props {
    id?:number | null;
    onClose:()=>void;
}


const BrandCreate:FC<props>=({id, onClose})=>{
    const { i18n } = useTranslation()
    const numericId = Number(id);
    const [subcategories, setsubcategories]=useState<SubcategoryDto[]>([]);    
    const [loading , setloading ]=useState(false);
    const [initialValues, setinitialValues]=useState<BrandDto>({
        id:0,        
        subcategoryId:0,       
        brandTranslations:[
           {id:0, brandId:0, language:"en", name:""},
           {id:0, brandId:0, language:"ar" , name:""}
        ]     
    })
    const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>(`Subcategory/combo?lang=${i18n.language}` ||`en`);
    const brandRepo=genericRepository<BrandDto[], BrandDto>("Brand/full");
    const brandbyIdRepoget = genericRepository<BrandDto[], BrandDto>(`Brand`);

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
            const result=await brandbyIdRepoget.getOne(numericId);
            if(!result.error && result.response)
            {
                const translation=result.response.brandTranslations;
                const en=translation.find(t=>t.language.toLowerCase()=="en")??{id:0, brandId:0, language:"en", name:""};
                const ar=translation.find(t=>t.language.toLowerCase()=="ar")??{id:0, brandId:0, language:"ar", name:""}
                setinitialValues({
                    id:result.response.id,                    
                    brandTranslations: [ en, ar ],
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
            setinitialValues({
                id:0,        
                subcategoryId:0,                
                brandTranslations:[
                {id:0, brandId:0, language:"en", name:""},
                {id:0, brandId:0, language:"ar" , name:""}
                ]                
                        
                })               
        }    
        console.log("brandin useEffect:", initialValues)   
    },[id, i18n.language])

    const validationSchema=Yup.object({       
        subcategoryId:Yup.number()
        .required("Subcategory is required")
        .min(1,"please select a subcategory"),
        brandTranslations:Yup.array().of(
            Yup.object({
              name:Yup.string().required("Name is required"),
            })
        )    
    })

    const formik=useFormik({
        initialValues,
        validationSchema,
        onSubmit:async(values)=>{
            try {
             
                const payload={
                                subcategoryId:values.subcategoryId,                               
                                brandTranslations:values.brandTranslations.map((t)=>({
                                language:t.language,
                                name:t.name,
                                })) , 
                                                                
                            }
                 console.log("brandtoserver:", payload);
                if(numericId) 
                {
                    await brandRepo.put( {...payload , id:numericId});
                }else {
                    await brandRepo.post(payload)
                    console.log("payload:", payload)
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
                {formik.values.brandTranslations.map((t, index)=>(
                    <Grid key={index} size={{xs:12}}>
                         <Typography variant="subtitle1">
                            name({t.language.toLocaleUpperCase()})
                        </Typography>
                            <TextField                               
                                name={`brandTranslations[${index}].name`}
                                size="small"
                                fullWidth
                                label={`Name (${t.language})`}
                                value={formik.values.brandTranslations[index].name}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.brandTranslations?.[index]?.name &&
                                    (formik.errors.brandTranslations?.[index] as any)?.name
                                }
                                helperText={
                                    formik.touched.brandTranslations?.[index]?.name &&
                                    (formik.errors.brandTranslations?.[index] as any)?.name
                                }           
                                />
                    </Grid>
                ))}        
             
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
                      {cat.subcategoryTranslations[0].name}
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