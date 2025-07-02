// src/pages/Categories/CategoriesCreate.tsx
import {
    Box,
    Button,
    Divider,
    Grid,
    TextField,
    Typography,
  } from "@mui/material";
  import { useFormik } from "formik";
  import { FC, useEffect, useState } from "react";
  import * as Yup from "yup";
  import LoadingComponent from "../../components/LoadingComponent";
  import CategoryRepository from "../../repositories/categoryRepository";
  
  interface Props {
    id?: number | null; // null تعني إنشاء جديد
    onClose: () => void;
  }
  
  const CategoriesCreate: FC<Props> = ({ id, onClose }) => {
    const numericId = Number(id);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState({ name: "", subcategories: null });
  
    const validationSchema = Yup.object({
      name: Yup.string().required("requiredField"),
    });
  
    const getCategoryById = async () => {
      setLoading(true);
      try {
        const data = await CategoryRepository().getById(numericId);
        setCategory({
          name: data.name,
          subcategories: null,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (id) {
        getCategoryById();
      } else {
        setCategory({ name: "", subcategories: null });
      }
    }, [id]);
  
    const formik = useFormik({
      initialValues: category,
      validationSchema,
      onSubmit: async (values) => {
        try {
          if (numericId) {
            await CategoryRepository().put({
              ...values,
              id: numericId,
            });
          } else {
            await CategoryRepository().post(values);
          }
          onClose(); // ✅ إغلاق المودال بعد الحفظ
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
              <Grid >
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
  
              <Grid >
                <Button type="submit" variant="outlined">
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    );
  };
  
  export default CategoriesCreate;
  