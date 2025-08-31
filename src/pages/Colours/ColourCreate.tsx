import { FC, useEffect, useState } from "react";
import genericRepository from "../../repositories/genericRepository";
import { ColourDTO } from "../../types/ColoutDTO";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import { MuiColorInput } from "mui-color-input";
import namer from "color-namer";

interface Props {
  id?: number | null;
  onClose: () => void;
}

const ColourCreate: FC<Props> = ({ id, onClose }) => {
  const numericId = Number(id);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    hexCode: "",
  });

  const repository = genericRepository<ColourDTO[], ColourDTO>("colours");

  const getColourbyId = async () => {
    try {
      setLoading(true);
      var result = await repository.getOne(numericId);
      if (!result.error && result.response) {
        setInitialValues({
          name: result.response.name,
          hexCode: result.response.hexCode,
        });
      } else {
        console.log("Error fetch colorId:", result.message);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    hexCode: Yup.string().required("Hex code is required"),
  });

  const getColorName = (hex: string): string => {
    try {
      const result = namer(hex);
      return result.ntc[0].name; 
    } catch {
      return "Custom Color";
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (numericId) {
          await repository.put({ ...values, id: numericId });
        } else {
          await repository.post(values);
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

  useEffect(() => {
    if (id) {
      getColourbyId();
    } else {
      setInitialValues({ name: "", hexCode: "" });
    }
  }, [id]);

  return (
    <Box>
      {loading ? (
        <LoadingComponent />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6">Add / Edit Colour</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>           
            <Grid size={{xs:12}} >
              <TextField
                id="name"
                name="name"
                fullWidth
                label="Color Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                disabled 
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </Grid>

            {/* Color Picker */}
            <Grid size={{xs:12}}>
              <MuiColorInput
                id="hexCode"
                name="hexCode"
                format="hex"
                label="Pick a Color"
                value={formik.values.hexCode}
                onChange={(color) => {
                  formik.setFieldValue("hexCode", color);
                  formik.setFieldValue("name", getColorName(color)); 
                }}
                fullWidth
                size="small"
              />
              {formik.touched.hexCode && formik.errors.hexCode && (
                <Typography color="error" variant="caption">
                  {formik.errors.hexCode}
                </Typography>
              )}
            </Grid>

            <Grid size={{xs:12}}>
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

export default ColourCreate;
