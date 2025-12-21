
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { DiscountRequestDTO } from "../../types/DiscountRequestDTO";
import genericRepository from "../../repositories/genericRepository";
import { MultipleSelectorModel } from "../../types/MultipleSelectorModel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import MultipleSelector from "../../components/MultipleSelector";
import { ProductResponseDTO } from "../../types/ProductResponseDTO";

const DiscountCreate=()=>{
    const { i18n } = useTranslation();   
    const[discount, setDiscount]=useState<DiscountRequestDTO>({
        Id:0,
        DiscountPercent:0,
        isActive:false,
        StartTime:"",
        Endtime:"",
        ProductIds:[],
    });

    const [nonSelectedProducts, setnonSelectedProducts]=useState<ProductResponseDTO[]>([]);
    const [selectedProducts, setSelectedProducts]=useState<MultipleSelectorModel[]>([]);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const nonSelectedProductOptions: MultipleSelectorModel[] =
       nonSelectedProducts.map(p=>({
        key:p.id.toString(),
        value: p.productTranslations
                ?.find(t => t.language === i18n.language)
                ?.name
            ?? p.productTranslations?.[0]?.name
            ?? "",
       }))
    const repo = genericRepository<DiscountRequestDTO[], DiscountRequestDTO>("Discounts/full");
    const ProductRepo = genericRepository<ProductResponseDTO[], ProductResponseDTO>(`Product/combo?lang=${i18n.language || "en"}`);
    const fetchProducts=async()=>{
        setLoading(true);
        try {
            const result = await ProductRepo.getAll();
            if (!result.error && result.response) {
                setnonSelectedProducts(result.response);
                console.log("Products:", result.response)
            } else {
                console.error("Error fetching products:", result.message);
            }            
        } catch (error) {
            
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
      const fetchData = async () => {
        await fetchProducts();       
      };
      fetchData();
    }, [ i18n.language]);
    const formik = useFormik<DiscountRequestDTO>({
    initialValues: {
        ...discount,        
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
                        DiscountPercent: Yup.number().min(0).required(),
                        StartTime: Yup.string().required(),
                        Endtime: Yup.string().required(),
                        ProductIds: Yup.array()
                            .of(Yup.number().min(1))
                            .min(1, "Select at least one product")
                            .required()
                        }),
    onSubmit: async (values) => {
          const language = i18n.language;
        // const t = values.productionTranslations.find(x => x.language === lang);
        // values.name = t?.name ?? "";
        // values.description = t?.description ?? "";
        // values.productCategoryIds = selectedCategories.map(x => +x.key);
        // values.ProductColorIds = selectedColorsState.map(x => +x.key);
        //values.ProductIds= selectedProducts.map(x => +x.key);

        await createOrUpdate(values);
    }
    });

    const createOrUpdate = async (values: DiscountRequestDTO) => {
                            const result =  await repo.post(values);
                            if (!result.error) {
                                navigate("/admin/discounts");
                            }
                            };
    if (loading) {
    return <LoadingComponent />;
    }

return(
    <form onSubmit={formik.handleSubmit}>
    <Box display="flex" justifyContent="space-between" mb={3}>
     <Typography variant="h6">
        💸 Create Discount
     </Typography>
     <Box justifyContent="space-between">
        <Button variant="contained" color="primary" type="submit" sx={{mr:2}}>
            💾 Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={()=>navigate("/admin/discounts")} sx={{mr:2}}>
            ← Return
        </Button>
     </Box>
    </Box>
    <Grid container spacing={3}>
        <Grid size={{xs:12 , md:4}}>
             <TextField
                fullWidth
                label="Discount Percent (%)"
                name="DiscountPercent"
                type="number"
                value={formik.values.DiscountPercent}
                onChange={formik.handleChange}
                error={formik.touched.DiscountPercent && Boolean(formik.errors.DiscountPercent)}
                helperText={formik.touched.DiscountPercent && formik.errors.DiscountPercent}
                variant="outlined"
            />            
        </Grid>
         {/* Start Time */}
        <Grid size={{xs:12, md:4}}>
        <TextField
            fullWidth
            label="Start Time"
            name="StartTime"
            type="date"           
            value={formik.values.StartTime}
            onChange={formik.handleChange}
            error={formik.touched.StartTime && Boolean(formik.errors.StartTime)}
            helperText={formik.touched.StartTime && formik.errors.StartTime}
        />
        </Grid>

        {/* End Time */}
        <Grid size={{xs:12, md:4}}>
        <TextField
            fullWidth
            label="End Time"
            name="Endtime"
            type="date"           
            value={formik.values.Endtime}
            onChange={formik.handleChange}
            error={formik.touched.Endtime && Boolean(formik.errors.Endtime)}
            helperText={formik.touched.Endtime && formik.errors.Endtime}
        />
        </Grid>  

    {/* Products Selector */}
    <Grid size={{xs:12, md:4}}>
      <Typography variant="subtitle1" mb={1}>
        Products:
      </Typography>

      <MultipleSelector
        selected={selectedProducts}
        nonSelected={nonSelectedProductOptions}
        onChange={(item)=>{
            setSelectedProducts(item);
            formik.setFieldValue(
                 "ProductIds",
                 item.map(x=>+ x.key)
            )
        }}
      />
      {formik.touched.ProductIds && formik.errors.ProductIds && (
        <Typography color="error" variant="caption">
          {formik.errors.ProductIds as string}
        </Typography>
      )}
    </Grid>
    </Grid>
</form>
)
}

export default DiscountCreate;