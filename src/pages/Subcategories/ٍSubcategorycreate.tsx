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
  import CategoryRepository from "../../repositories/categoryRepository";
  import SubcategoryRepository from "../../repositories/subcategoryRepository";
  import LoadingComponent from "../../components/LoadingComponent";
  
  interface Props {
    id?: number | null;
    onClose: () => void;
  }
  
  const SubcategoryCreate: FC<Props> = ({ id, onClose }) => {
    const numericId = Number(id);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>(
      []
    );
  
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
      name: "",
      categoryId: 0,
    });
  
    const fetchCategories = async () => {
      try {
        const data = await CategoryRepository().get();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };
  
    const getSubcategoryById = async () => {
      setLoading(true);
      try {
        const data = await SubcategoryRepository().getById(numericId);
        setInitialValues({
          name: data.name,
          categoryId: data.categoryId,
        });
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
        setInitialValues({ name: "", categoryId: 0 });
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
            await SubcategoryRepository().put({ ...values, id: numericId });
          } else {
            await SubcategoryRepository().post(values);
          }
          onClose();
        } catch (error) {
          console.log(error);
        }
      },
      validateOnBlur: false,
      validateOnMount: true,
      enableReinitialize: true, // مهم جدًا لتحديث القيم عند تحميل البيانات
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
  