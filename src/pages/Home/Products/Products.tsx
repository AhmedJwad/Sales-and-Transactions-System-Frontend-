import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { ProductDTO } from "../../../types/ProductDTO";
import genericRepository from "../../../repositories/genericRepository";
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";


const Products=()=>{
    const{subcategoryId}=useParams<{subcategoryId:string}>();
    const [products, setProducts]=useState<ProductDTO[]>([]);
    const [loading ,setLoading] =useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined); 
    const ProductRepo=genericRepository<ProductDTO[], ProductDTO>(`product/getproductbysubcategory/${subcategoryId}`);
    const fetchProducts=async()=>{
        try {
            setLoading(true)
            var result=await ProductRepo.getAll();
            if(!result.error && result.response)
            {
                setProducts(result.response)
                console.log("Prodcts:", result.response)
            }else
            {
                console.error("Error fetch products:", result.error);
                setErrorMessage("Failed to load Products. Please try again.")
            }            
        } catch (error) {
             console.error("Network error:", error);
                setErrorMessage("Network error while loading Products. Please check your connection.");
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(subcategoryId)
        {
            fetchProducts();
        }
    },[subcategoryId]);
    return(
        <Box sx={{p:{xs:2, md:4}}}>
            <Typography variant="h4" sx={{mb:3 , fontWeight:"bold"}}>
                   Products in SubCategory {subcategoryId}
            </Typography>
            <Grid container spacing={3}>
                {products.map((prod)=>(
                    <Grid size={{xs:12, sm:6, md:4}} key={prod.id}>  
                    <Card>
                       <CardMedia
                        component="img"
                        height="200"
                        image={`https://localhost:7027/${prod.productImages?.[0]}`}
                        alt={prod.name}
                       />
                       <CardContent>
                        <Typography variant="h6">{prod.name}</Typography> 
                        <Typography color="text.secondary">{prod.description}</Typography>
                        <Typography color="text.primary">{prod.price}</Typography>
                        <Button  variant="contained" sx={{mt:2}}>
                            Buy Now
                        </Button>
                       </CardContent>
                    </Card>                      
                    </Grid>
                ))}                
            </Grid>
        </Box>
    )

}
export default Products;