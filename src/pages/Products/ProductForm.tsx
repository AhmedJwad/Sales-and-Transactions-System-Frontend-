import { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import CarouselView from "../../components/CarouselView";
import MultipleSelector from "../../components/MultipleSelector";
import { MultipleSelectorModel } from "../../types/MultipleSelectorModel";
import { ProductDtoRequest } from "../../types/ProductDtorequest";
import { SubcategoryDto } from "../../types/SubcategoryDto";
import LoadingComponent from "../../components/LoadingComponent";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import ImageUploader from "../../components/ImageUploader";

interface ProductFormProps {
  product: ProductDtoRequest;
  isEdit?: boolean;
  nonSelectedSubcategories: SubcategoryDto[];
  selectedSubcategories: SubcategoryDto[];
  onValidSubmit: (values: ProductDtoRequest) => Promise<void> | void;
  returnAction: () => void;
  addImageAction?: () => void;
  removeImageAction?: () => void;
}

const ProductForm: FC<ProductFormProps> = ({
  product,
  isEdit = false,
  nonSelectedSubcategories,
  selectedSubcategories,
  onValidSubmit,
  returnAction,
  addImageAction,
  removeImageAction,
}) => {
  const [loading] = useState(false);

  const [selected, setSelected] = useState<MultipleSelectorModel[]>(
    selectedSubcategories.map((x) => ({ key: x.id.toString(), value: x.name }))
  );

  const [nonSelected] = useState<MultipleSelectorModel[]>(
    nonSelectedSubcategories.map((x) => ({ key: x.id.toString(), value: x.name }))
  );

  const formik = useFormik<ProductDtoRequest>({
    initialValues: product,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number().min(0).required("Price is required"),
      cost: Yup.number().min(0).required("Cost is required"),
      stock: Yup.number().min(0).required("Stock is required"),
      desiredProfit: Yup.number().min(0).required("Desired profit is required"),
    }),
    onSubmit: async (values) => {
      values.productCategoryIds = selected.map((x) => parseInt(x.key));
      await onValidSubmit(values);
    },
  });

  const handleSelectorChange = (newSelected: MultipleSelectorModel[]) => {
    setSelected(newSelected);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">👜 Create New Product</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={formik.submitForm}
            sx={{ mr: 2 }}
          >
            💾 Save Changes
          </Button>
          <Button variant="contained" color="success" onClick={returnAction}>
            ← Return
          </Button>
        </Box>
      </Box>

      {loading ? (
        <LoadingComponent />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            {/* Column 1: Basic Info */}
            <Grid size={{xs:12, md:4}}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                minRows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formik.values.stock}
                onChange={formik.handleChange}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
              />
            </Grid>

            {/* Column 2: Category Selector */}
            <Grid size={{xs:12, md:6}}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Categories:
              </Typography>
              <MultipleSelector
                selected={selected}
                nonSelected={nonSelected}
                onChange={handleSelectorChange}
              />
            </Grid>

            {/* Column 3: Image Uploader */}
            <Grid size={{xs:12, md:4}}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Photo
              </Typography>
              <ImageUploader
                onImageSelected={(base64) => {
                  const current = formik.values.productImages ?? [];
                  formik.setFieldValue("productImages", [...current, base64]);
                }}
                initialImage={formik.values.productImages?.[0]}
              />

              {isEdit && (
                <Box mt={2} display="flex" gap={2}>
                  {addImageAction && (
                    <Button variant="outlined" color="primary" onClick={addImageAction}>
                      Add Image
                    </Button>
                  )}
                  {removeImageAction && (
                    <Button variant="outlined" color="error" onClick={removeImageAction}>
                      Remove Image
                    </Button>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Image Preview */}
          {isEdit && formik.values.productImages && formik.values.productImages.length > 0 && (
            <Box mt={4}>
              <CarouselView images={formik.values.productImages} />
            </Box>
          )}
        </form>
      )}
    </Box>
  );
};

export default ProductForm;
