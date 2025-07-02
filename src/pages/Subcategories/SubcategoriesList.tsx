import { Box } from "@mui/material";
import { useEffect, useState } from "react"
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import LoadingComponent from "../../components/LoadingComponent";
import SubcategoryRepository from "../../repositories/subcategoryRepository";
import SubcategoryCreate from "./ٍSubcategorycreate";


const SubcategoriesList=()=>{
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number | null>(null)

    const columns=[
        {field:"id" , headerName:"ID" , flex:1},
        {field:"name" , headerName:"Name" , flex:3},
        {field:"category" , headerName:"Category" , flex:6}        
    ]
    const getSubcategories=async()=>{
        setLoading(true)
        try {
            const data=await SubcategoryRepository().get();
            setRows(data.map((item:any)=>({...item,id:item.id,  category: item.category?.name || "N/A",})))            
        } catch (error) { 
            console.log(error)      
                       
        }finally{
            setLoading(false)
        }
    }
    const handleDelete=async(id:number)=>{
       try {
        setLoading(true);
        await SubcategoryRepository().delete(id);
        await getSubcategories();            
       } catch (error) {
        console.log(error)        
       }finally{
        setLoading(false)
       }
    }
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setEditId(null);
        getSubcategories();        
    }
    useEffect(()=>{
        getSubcategories();
    },[])
    return (
        <Box>
          {loading ? (
            <LoadingComponent />
          ) : (
            <>
              <DataGridCustom
                columns={columns}
                rows={rows}
                title="Subcategory"
                filtercolumn={["name"]}
                onDelete={handleDelete}
                onCreateClick={() => {
                  setEditId(null);
                  setDialogOpen(true);
                }}
                onEditClick={(id) => {
                  setEditId(id);
                  setDialogOpen(true);
                }}
              />
    
              <GenericDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                title={editId ? "Edit Subcategory" : "Create Subcategory"}
              >
                <SubcategoryCreate id={editId} onClose={handleDialogClose} />
              </GenericDialog>
            </>
          )}
        </Box>
      );
    };

    export default SubcategoriesList;