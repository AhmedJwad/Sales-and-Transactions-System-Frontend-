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
  
  interface Props {
    id?: number | null;
    onClose: () => void;
  }
  
  const SubcategoryCreate: FC<Props> = ({ id, onClose }) => {
    const numericId = Number(id);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
      name: "",
      categoryId: 0,
      photo:"",
    });
  
    const categoryRepo = genericRepository<CategoryDto[], CategoryDto>("categories");
    const subcategoryRepo = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory/full");
    const subcategoryRepoget = genericRepository<SubcategoryDto[], SubcategoryDto>("Subcategory");
  
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
          setInitialValues({
            name: result.response.name,
            categoryId: result.response.categoryId,
            photo:result.response.photo ?? "",
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
        setInitialValues({ name: "", categoryId: 0 , photo:""});
      }
    }, [id]);
  
    const validationSchema = Yup.object({
      name: Yup.string().required("Name is required"),
      categoryId: Yup.number()
        .required("Category is required")
        .min(1, "Please select a category"),
    });
  
    const formik = useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
        try {
          if (numericId) {
            await subcategoryRepo.put({ ...values, id: numericId });
          } else {
            await subcategoryRepo.post(values);
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
              {numericId ? "Edit Subcategory" : "Create Subcategory"}
            </Typography>
            <Divider sx={{ my: 2 }} />
  
            <Grid container spacing={2}>
              <Grid>
                <TextField
                  id="name"
                  name="name"
                  fullWidth
                  label="Subcategory Name"
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
                                                      const current = formik.values.photo;
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
  