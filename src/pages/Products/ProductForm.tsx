import { FC, useEffect, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import ImageUploader from "../../components/ImageUploader";
import { ColourDTO } from "../../types/ColoutDTO";
import { SizeDTO } from "../../types/SizeDTO";
import { BrandDto } from "../../types/BrandDto";
import genericRepository from "../../repositories/genericRepository";

interface ProductFormProps {
  product: ProductDtoRequest;
  isEdit?: boolean;
  nonSelectedSubcategories: SubcategoryDto[];
  selectedSubcategories: SubcategoryDto[];
  nonSelectedColors: ColourDTO[];
  selectedColors: ColourDTO[];
  nonSelectedSizes: SizeDTO[];
  selectedSizes: SizeDTO[];
  onValidSubmit: (values: ProductDtoRequest) => Promise<void> | void;
  returnAction: () => void;
  addImageAction?: (images: string[], selectedColor?: { id: number; hexCode: string }) => void;
  //addImageAction?: (images: string[], selectedColor?: ColourDTO) => void;
  removeImageAction?: (images: string[]) => void;
}

const ProductForm: FC<ProductFormProps> = ({
  product,
  isEdit = false,
  nonSelectedSubcategories,
  selectedSubcategories,
  nonSelectedColors,
  selectedColors,
  nonSelectedSizes,
  selectedSizes,
  onValidSubmit,
  returnAction,
  addImageAction,
  removeImageAction,
}) => {
  const [loading] = useState(false);
  // 🟢 Subcategories state
  const [selectedCategories, setSelectedCategories] = useState<MultipleSelectorModel[]>(
    selectedSubcategories.map((x) => ({ key: x.id.toString(), value: x.name }))
  );
  const [nonSelectedCategories] = useState<MultipleSelectorModel[]>(
    nonSelectedSubcategories.map((x) => ({ key: x.id.toString(), value: x.name })));
  // 🟢 Colors state
  const [selectedColorsState, setSelectedColorsState] = useState<MultipleSelectorModel[]>(
    selectedColors.map((x) => ({ key: x.id.toString(), value: x.hexCode  })));
  const [nonSelectedColorsState] = useState<MultipleSelectorModel[]>(
    nonSelectedColors.map((x) => ({ key: x.id.toString(), value: x.hexCode })));
  // 🟢 Sizes state
  const [selectedSizesstate, setSelectedSizesstate] = useState<MultipleSelectorModel[]>(
    selectedSizes.map((x) => ({ key: x.id.toString(), value: x.name  })));
  const [nonSelectedSizesState] = useState<MultipleSelectorModel[]>(nonSelectedSizes.map((x) => ({ key: x.id.toString(), value: x.name }))
  );
  const [brand ,setBrand]=useState<BrandDto[]>([]);
  const brandRepo=genericRepository<BrandDto[], BrandDto>("Brand/combo");

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
      // 🟢 Add selected categories + colors IDs to payload
      values.productCategoryIds = selectedCategories.map((x) => parseInt(x.key));
      values.ProductColorIds = selectedColorsState.map((x) => parseInt(x.key));
      values.ProductSizeIds=selectedSizesstate.map((x)=>parseInt(x.key));
      await onValidSubmit(values);
    },
  });

  const handleCategoryChange = (newSelected: MultipleSelectorModel[]) => {
    setSelectedCategories(newSelected);
  };

  const handleColorChange = (newSelected: MultipleSelectorModel[]) => {
    setSelectedColorsState(newSelected);
  };
   const handlesizeChange = (newSelected: MultipleSelectorModel[]) => {
   setSelectedSizesstate(newSelected);
  };
  const getContrastColor = (hexColor: string) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};
const fetchBrands=async()=>{      
        try {
            const result=await brandRepo.getAll();
            if(!result.error && result.response)
            {
               setBrand(result.response)

            }
            else
            {
                console.error("Error fetching subcategories:", result.message);
            }
        } catch (error:any) {
            console.error("Unexpected error:", error.message || error);  
        }finally{
           
        }
    }
useEffect(() => {
  // Categories
  const selectedCatMapped = selectedSubcategories.map((x) => ({ key: x.id.toString(), value: x.name }));  
  setSelectedCategories(selectedCatMapped);
  // Colors
  const selectedColorMapped = selectedColors.map((x) => ({ key: x.id.toString(), value: x.hexCode }));  
  setSelectedColorsState(selectedColorMapped);  
    const selectedsizeMapped =selectedSizes.map((x) => ({ key: x.id.toString(), value: x.name }));  
 setSelectedSizesstate(selectedsizeMapped);  
 fetchBrands();
}, [selectedSubcategories, nonSelectedSubcategories, selectedColors, nonSelectedColors, selectedSizes, nonSelectedSizes]);
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          {isEdit ? "👜 Edit Product" : "👜 Create New Product"}
        </Typography>
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
            <Grid size={{xs:12, md:4}}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Categories:
              </Typography>
              <MultipleSelector
                selected={selectedCategories}
                nonSelected={nonSelectedCategories}
                onChange={handleCategoryChange}
              />
               <Typography variant="subtitle1" sx={{ mb: 1 }}>
               Sizes:
              </Typography>
              <MultipleSelector
                selected={selectedSizesstate}
                nonSelected={nonSelectedSizesState}
                onChange={handlesizeChange}
              />
              {/* Colors Preview */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Selected Colors:
                </Typography>              

                {/* MultipleSelector for selection (unchanged) */}
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {selectedColorsState.map((option) => (
                    <span
                      key={option.key}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        backgroundColor: option.value, 
                        borderRadius: '50%',
                        border: `1px solid ${getContrastColor(option.value)}`,
                        cursor: 'pointer'
                      }}
                      title={option.value} 
                      onClick={() => {                      
                        const newSelected = selectedColorsState.filter(c => c.key !== option.key);
                        handleColorChange(newSelected);
                      }}
                    ></span>
                  ))}
                </div>

                <MultipleSelector
                  selected={selectedColorsState}
                  nonSelected={nonSelectedColorsState}
                  onChange={handleColorChange}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {nonSelectedColorsState.map((option) => (
                    <span
                      key={option.key}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        backgroundColor: option.value, 
                        borderRadius: '50%',
                        border: `1px solid ${getContrastColor(option.value)}`,
                        cursor: 'pointer'
                      }}
                      title={option.value} 
                      onClick={() => {                      
                        handleColorChange([...selectedColorsState, option]);
                      }}
                    ></span>
                  ))}</div>
                   <TextField
                                    style={{ marginTop: '20px' }}
                                    select
                                    id="BrandId"
                                    name="BrandId"
                                    label="Brand"
                                    fullWidth
                                    value={formik.values.BrandId}
                                    onChange={formik.handleChange}
                                    error={
                                      formik.touched.BrandId &&
                                      Boolean(formik.errors.BrandId)
                                    }
                                    helperText={
                                      formik.touched.BrandId && formik.errors.BrandId
                                    }
                                    size="small"
                                  >
                                    <MenuItem value={0} disabled>
                                      -- Select a brand --
                                    </MenuItem>
                                    {brand.map((cat) => (
                                      <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </MenuItem>
                                    ))}
                                  </TextField>
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
                <Box
                  mt={2}
                  width="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                  gap={2}
                >
                 <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    const color = selectedColorsState[0]
                      ? { id: parseInt(selectedColorsState[0].key), hexCode: selectedColorsState[0].value }
                      : undefined;

                    addImageAction?.(formik.values.productImages ?? [], color);
                  }}
                >
                  Add Image
                </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeImageAction?.(formik.values.productImages ?? [])}
                  >
                    Remove Image
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Image Preview */}
          {isEdit &&
            formik.values.productImages &&
            formik.values.productImages.length > 0 && (
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
