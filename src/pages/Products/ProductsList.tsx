import { Box } from "@mui/material";
import { useEffect, useState } from "react"
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { ProductDTO } from "../../types/ProductDTO";
import BrandCreate from "../Brands/Brandcreate";
const ProductList=()=>{
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number |null>(null);
    const renderImageCell = (params: any) => {
        const imageUrl = `https://localhost:7027/${params.value}`;
        return (
          <img
            src={imageUrl}
            alt="Product"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
          />
        );
      };
    const columns=[      
        { field: "name", headerName: "Name", flex: 6 },
        //{ field: "barcode", headerName: "Barcode", flex: 6 },
        { field: "description", headerName: "Description", flex: 6},
        { field: "price", headerName: "Price", flex: 3 },
        //{ field: "cost", headerName: "Cost", flex: 6 },
        //{ field: "profit", headerName: "profit", flex: 6 },
        //{ field: "costValue", headerName: "costValue", flex: 6 },
        //{ field: "priceValue", headerName: "priceValue", flex: 6 },
       // { field: "realProfit", headerName: "realProfit", flex: 6 },
       // { field: "desiredProfit", headerName: "desiredProfit", flex: 6 },
        { field: "stock", headerName: "stock", flex: 3 },
        { field: "brand", headerName: "brand", flex: 6 },
        {
            field: "categories",
            headerName: "Categories",
            flex: 6,
            
          },
          {
            field: "subcategories",
            headerName: "Subcategories",
            flex: 6,
           
          },
        { field: "image", headerName: "Image", flex: 6, renderCell:renderImageCell},       
    ]
  
    const repository = genericRepository<ProductDTO[], ProductDTO>("Product");
   const getProducts=async()=>{
    setLoading(true);
    try {
            const data=await repository.getAll();
            if(!data.error && data.response)
            {
                const products=data.response.map((item:ProductDTO)=>({
                    ...item,
                    id:item.id,
                    categories: Array.isArray(item.categories) ? item.categories : [],
                    subcategories: Array.isArray(item.subcategories) ? item.subcategories : [],             
                }));
                setRows(products);                  
            }else{
                console.error("Error fetching Products:", data.message);
            }        
        } catch (error:any) {
            console.error("Unexpected error:", error.message || error);         
        }finally{
            setLoading(false);
        }
    }
    const handleDelete=async(id:number)=>{
        try {
            setLoading(true);
            const result=await repository.getOne(id);
            if(!result.error)  
            {
                await getProducts();
            }else{
                console.error("Delete failed:", result.message || "Unknown error")
            }                     
            
        } catch (error:any) {
            console.error("Unexpected error during delete:", error.message || error);             
        }finally{
            setLoading(false);
        }
    }
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setEditId(null);
        getProducts();
    }
    useEffect(()=>{
        getProducts();
    },[])

    return(  
        <Box>
              {loading ? (<LoadingComponent/>): (<><DataGridCustom 
            columns={columns}
            rows={rows}
            title="Products"
            filtercolumn={["name"]}
            onDelete={handleDelete}
            onCreateClick={() => {
                setEditId(null);
                setDialogOpen(true);
              }}
            onEditClick={(id)=>{
                setEditId(id),
                setDialogOpen(true);
            }}
            />
            <GenericDialog open={dialogOpen} onClose={handleDialogClose} title={editId? "Edit Product" : "Create Product"}>         
            <BrandCreate id={editId} onClose={handleDialogClose}/>
            </GenericDialog>
            </>)}            
        </Box>
    )
}
export default ProductList
