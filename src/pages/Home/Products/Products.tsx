import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { ProductDTO } from "../../../types/ProductDTO";
import genericRepository from "../../../repositories/genericRepository";
import { Box, Button, Card, CardContent, CardMedia, Grid, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../../components/LoadingComponent";
import Pagination from '@mui/material/Pagination';
import Autocomplete from '@mui/material/Autocomplete';


const Products=()=>{
    const{subcategoryId}=useParams<{subcategoryId:string}>();
    const [products, setProducts]=useState<ProductDTO[]>([]);
    const [loading ,setLoading] =useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined); 
    const ProductRepo=genericRepository<ProductDTO[], ProductDTO>(`product/getproductbysubcategory/${subcategoryId}`);
      const [page, setPage] = useState(1);      
        const [pageSize] = useState(10);
        const [searchText, setSearchText] = useState("");
         const filteredProducts = products.filter((prod) =>
            prod.name.toLowerCase().includes(searchText.toLowerCase())
        );
        
        const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
        const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
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
            {loading? (<LoadingComponent/>):(
            <>
             <Typography variant="h4" sx={{mb:3 , fontWeight:"bold"}}>
                   Products in SubCategory {subcategoryId}
            </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Autocomplete
                                freeSolo
                                options={products.map((p) => p.name)}
                                inputValue={searchText}
                                onInputChange={(event, newInputValue) => {
                                setSearchText(newInputValue);
                                setPage(1);
                                }}
                                sx={{ width: 700 }} 
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Products"
                                    variant="outlined"
                                    sx={{ 
                                    width: '100%', 
                                    height: 50,                
                                    '& .MuiInputBase-root': { 
                                        height: '100%',          
                                        fontSize: '18px'         
                                    },
                                    '& .MuiInputLabel-root': { fontSize: '20px' } 
                                    }}
                                />
                                )}
                            />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb:4 }}>
                            <Pagination
                                count={Math.ceil(filteredProducts.length / pageSize)}
                                page={page}
                                onChange={handlePageChange}
                                variant="outlined"
                                color="primary"
                            />
                            </Box>
            <Grid container spacing={3}>
                {paginatedProducts.map((prod)=>(
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
            </>
        )}           
        </Box>
    )

}
export default Products;