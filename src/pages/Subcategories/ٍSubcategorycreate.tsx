// src/pages/Subcategories/SubcategoryCreate.tsx
import {
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    TextField,
    Typography,
  } from "@mui/material";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { FC, useEffect, useState } from "react";
  import LoadingComponent from "../../components/LoadingComponent";
  import genericRepository from "../../repositories/genericRepository";
  import { CategoryDto } from "../../types/CategoryDto";
  import { SubcategoryDto } from "../../types/SubcategoryDto";
  import ImageUploader from "../../components/ImageUploader";
  import { useTranslation } from "react-i18next";

  
  interface Props {
    id?: number | null;
    onClose: () => void;
  }
  
  const SubcategoryCreate: FC<Props> = ({ id, onClose }) => {
    const { i18n } = useTranslation()
    const numericId = Number(id);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<SubcategoryDto>({
      id:0,
      categoryId: 0,
      photo:"",
      subcategoryTranslations:[],
    });
  
    const categoryRepo = genericRepository<CategoryDto[], CategoryDto>(`categories/combo?lang=${i18n.language || "en"}`);
    const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory/full");
    const subcategoryRepoget = genericRepository<SubcategoryDto[], SubcategoryDto>(`Subcategory`);
  
    const fetchCategories = async () => {
      try {
        const result = await categoryRepo.getAll();
        if (!result.error && result.response) {
          setCategories(result.response);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    const getSubcategoryById = async () => {
      setLoading(true);
      try {
        const result = await subcategoryRepoget.getOne(numericId);
        if (!result.error && result.response) {
         const translations = result.response.subcategoryTranslations;
        const en = translations.find(t => t.language.toLowerCase() === "en") ?? { id: 0, subcategoryId: result.response.id, language: "en", name: "" };
        const ar = translations.find(t => t.language.toLowerCase() === "ar") ?? { id: 0, subcategoryId: result.response.id, language: "ar", name: "" };
        setInitialValues({
          id: result.response.id,
          categoryId: result.response.categoryId,
          photo: result.response.photo ?? "",
          subcategoryTranslations: [en, ar],
        });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCategories();
      if (id) {
        getSubcategoryById();
      } else {
        setInitialValues({id:0, categoryId: 0 , photo:"", subcategoryTranslations:[{
          id:0,
          name:"",
          language:"en",
          subcategoryId:0,
        },
      {
          id:0,
          name:"",
          language:"ar",
          subcategoryId:0,
        }],
      });
      }
    }, [id, i18n.language]);
  
    const validationSchema = Yup.object({      
      categoryId: Yup.number()
        .required("Category is required")
        .min(1, "Please select a category"),
        subcategoryTranslations:Yup.array().of(
          Yup.object({
             name:Yup.string().required("Name is required"),
          })
        )

    });
  
    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
        try {
          const payload={
            categoryId:values.categoryId,
             photo:values.photo,   
            SubcategoryTranslations:values.subcategoryTranslations.map((t)=>({
              Language:t.language,
              name:t.name,
            }))         
          }          
          if (numericId) {
            await subcategoryRepo.put({ ...payload, id: numericId });
          } else {
            await subcategoryRepo.post(payload);
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
            <Divider sx={{ my: 2 }} />  
            <Grid container spacing={2}>
              {formik.values.subcategoryTranslations.map((t, index)=>(
                <Grid key={index} size={{xs:12}}>
                  <Typography variant="subtitle1">
                    name({t.language.toLocaleUpperCase()})
                  </Typography>
                   <TextField                    
                      name={`subcategoryTranslations[${index}].name`}
                      size="small"
                      fullWidth
                      label={`Name (${t.language})`}
                      value={formik.values.subcategoryTranslations[index].name}
                      onChange={formik.handleChange}
                     error={
                        formik.touched.subcategoryTranslations?.[index]?.name &&
                        (formik.errors.subcategoryTranslations?.[index] as any)?.name
                      }
                      helperText={
                        formik.touched.subcategoryTranslations?.[index]?.name &&
                        (formik.errors.subcategoryTranslations?.[index] as any)?.name
                      }           
                />
                </Grid>
              ))}
             
  
              <Grid>
                <TextField
                  select
                  id="categoryId"
                  name="categoryId"
                  label="Category"
                  fullWidth
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.categoryId &&
                    Boolean(formik.errors.categoryId)
                  }
                  helperText={
                    formik.touched.categoryId && formik.errors.categoryId
                  }
                  size="small"
                >
                  <MenuItem value={0} disabled>
                    -- Select a category --
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
                 <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                    Photo
                                                  </Typography>
                                                   <Grid size={{xs:12, sm:6}}>
                                                              {formik.values.photo && (
                                                                <Box mb={2} textAlign="center">
                                                                    <img
                                                                    src={`${"https://localhost:7027/"}${formik.values.photo}`}
                                                                    alt="User"
                                                                    style={{
                                                                        width: 300,
                                                                        height: 300,
                                                                        borderRadius: "50%",
                                                                        objectFit: "cover",
                                                                        border: "2px solid #ccc"
                                                                    }}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Grid>
                                                  <ImageUploader
                                                    onImageSelected={(base64) => {                                                     
                                                      formik.setFieldValue("photo", base64);
                                                    }}
                                                    initialImage={formik.values.photo?.[0]}
                                                  />            
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
  };
  
  export default SubcategoryCreate;
  