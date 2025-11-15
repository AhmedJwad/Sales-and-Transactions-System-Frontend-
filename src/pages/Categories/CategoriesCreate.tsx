import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik} from "formik";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import ImageUploader from "../../components/ImageUploader";
import { CategoryDto } from "../../types/CategoryDto";

interface Props {
  id?: number | null;
  onClose: () => void;
}

const CategoriesCreate: FC<Props> = ({ id, onClose }) => {
  const numericId = Number(id);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<CategoryDto>({
    id: 0,
    photo: "",   
    categoryTranslations: [
      {id:0, categoryId:0, language: "en", name: "" },
      { id:0, categoryId:0,language: "ar", name: "" },
    ], 
  });

  const repository = genericRepository<CategoryDto[], CategoryDto>("categories/full");
  const reposcategory = genericRepository<CategoryDto[], CategoryDto>("categories");

  const validationSchema = Yup.object({
    categoryTranslations: Yup.array().of(
      Yup.object({
        language: Yup.string().required("Required"),
        name: Yup.string().required("Required"),
      })
    ),
  });

  const getCategoryById = async () => {
    setLoading(true);
    try {
      const result = await reposcategory.getOne(numericId);
      if (!result.error && result.response) {
        setCategory(result.response);
      }
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
      setCategory({
        id: 0,
        photo: "",
      categoryTranslations: [
      {id:0, categoryId:0, language: "en", name: "" },
      { id:0, categoryId:0,language: "ar", name: "" },
    ],   
     subcategories: [],
      });
    }
  }, [id]);

  const formik = useFormik({
    initialValues: category,
    validationSchema,
    onSubmit: async (values) => {
      try {
      const payload = {
       photo:values.photo 
         ? values.photo.startsWith("data:image") 
           ? values.photo       
           : values.photo       
           : null,     
       categoryTranslations: values.categoryTranslations.map((t) => ({
        language: t.language,
        name: t.name,
          })),
        };
        if (numericId) {
          await repository.put({ ...payload, id: numericId });
        } else {
          await repository.post(payload);
        }
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
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
            {formik.values.categoryTranslations.map((t, index) => (
              <Grid key={index} size={{xs:12}}>
                <Typography variant="subtitle1">
                  Name ({t.language.toUpperCase()})
                </Typography>
                <TextField
                  name={`categoryTranslations[${index}].name`}
                  size="small"
                  fullWidth
                  label={`Name (${t.language})`}
                  value={formik.values.categoryTranslations[index].name}
                  onChange={formik.handleChange}
                  error={
                    !!formik.errors.categoryTranslations &&
                    !!formik.errors.categoryTranslations[index]
                  }
                  helperText={
                    formik.errors.categoryTranslations &&
                    (formik.errors.categoryTranslations[index] as any)?.name
                  }
                />
              </Grid>
            ))}

            {/* الصورة */}
            <Grid size={{xs:12}}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Photo
              </Typography>

              {formik.values.photo && formik.values.photo.startsWith("categories/") && (
                <Box mb={2} textAlign="center">
                  <img
                    src={`https://localhost:7027/${formik.values.photo}`}
                    alt="Category"
                    style={{
                      width: 300,
                      height: 300,
                      borderRadius: "10%",
                      objectFit: "cover",
                      border: "2px solid #ccc",
                    }}
                  />
                </Box>
              )}

              <ImageUploader
                onImageSelected={(base64) => {
                  formik.setFieldValue("photo", base64);
                }}
                initialImage={formik.values.photo!}
              />
            </Grid>

            {/* زر الحفظ */}
            <Grid size={{xs:12}}>
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
