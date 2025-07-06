import { Box } from "@mui/material";
import { useEffect, useState } from "react"
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import LoadingComponent from "../../components/LoadingComponent";
import genericRepository from "../../repositories/genericRepository";
import { BrandDto } from "../../types/BrandDto";
import SubcategoryCreate from "../Subcategories/ٍSubcategorycreate";
import BrandCreate from "./Brandcreate";


const BrandsList=()=>{
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number| null>(null);

    const columns=[
        { field:"id" , headerName:"ID" ,flex:1},
        { field:"name" , headerName:"Name" ,flex:3},
        { field:"subcategory" , headerName:"SubCategory" ,flex:3}
    ];
    const repository=genericRepository<BrandDto[], BrandDto>("Brand");
    const getBrands=async()=>{
        setLoading(true);       
        try {   
            const data=await repository.getAll();        
            if(!data.error && data.response)
            {
                const brands=data.response.map((item:BrandDto)=>({
                    ...item,
                    id:item.id,
                    subcategory:item.subcategory?.name ||"N/A"
                }));
                setRows(brands);
            } else{
                console.error("Error fetching brands:", data.message);
            }   
        } catch (error:any) {
            console.error("Unexpected error:", error.message || error);            
        }finally{
            setLoading(false);
        }
    }
    const handleDelete = async(id: number)=>{
        try {
            setLoading(true);
           const result= await repository.delete(id);
           if(!result.error)
           {
            await getBrands();
           } 
           else
           {
             console.error("Delete failed:", result.message || "Unknown error")
           }        
        } catch (error:any) {
            console.error("Unexpected error during delete:", error.message || error);            
        }finally{
            setLoading(false)
        }
    };
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setEditId(null);
        getBrands();
    }
    useEffect(()=>{ 
        getBrands();
    },[]);
    return(
        <Box>
           {loading ? (<LoadingComponent/>): (<><DataGridCustom 
            columns={columns}
            rows={rows}
            title="Brands"
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
            <GenericDialog open={dialogOpen} onClose={handleDialogClose} title={editId? "Edit Brand" : "Create Brand"}>         
            <BrandCreate id={editId} onClose={handleDialogClose}/>
            </GenericDialog>
            </>)}
        </Box>
    )
}
export default BrandsList;