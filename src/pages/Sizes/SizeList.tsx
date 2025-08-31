import { useEffect, useState } from "react"
import genericRepository from "../../repositories/genericRepository";
import { SizeDTO } from "../../types/SizeDTO";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import SizeCreate from "./SizeCreate";

const SizeList=()=>{
    const[loading , setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const[editId, setdEditId]=useState<number | null>(null);
    const column=[
         {field:"name" , headerName:"Name", flex:3 },
    ]
    const repository=genericRepository<SizeDTO[], SizeDTO>("sizes");
    const getSizes=async()=>{
        try {
            setLoading(true);
            const result=await repository.getAll();
            if(!result.error && result.response)  
                {
                    const sizes=result.response.map((item:SizeDTO)=>({
                        ...item,
                        id:item.id,
                        productSizes:item.productSizes || "N/A",
                    }))
                   setRows(sizes);
                }
                else
                {
                   console.log("error fetch colours", result.message)           
                }          
        } catch (error) {
            console.log("Error:", error)
        }finally
        {
            setLoading(false);
        }
    }

    const handleDelete=async(id:number)=>{
        try {
            setLoading(true)
            const result=await repository.delete(id);
            if(result.error)
            {
                getSizes();
            }
            else
            {
                 console.error("Delete failed:", result.message || "Unknown error");
            }
        } catch (error) {
             console.log("Error:", error)
        }finally{
            setLoading(false);
        }
    }
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setdEditId(null);
        getSizes();
    }
    useEffect(()=>
        {
            getSizes();            
        },[])
        return(
            <Box>
                {loading?(<LoadingComponent/>):(
                    <>
                    <DataGridCustom
                    columns={column}
                    rows={rows}
                    title="Sizes"
                    filtercolumn={["name"]}
                    onDelete={handleDelete}
                    onCreateClick={()=>{
                    setdEditId(null);
                    setDialogOpen(true);
                    }                    
                    }
                    onEditClick={(id)=>{
                        setdEditId(id);
                        setDialogOpen(true)
                    }}
                    />
                   <GenericDialog open={dialogOpen} onClose={handleDialogClose} title={editId ? "Edits size" : "Create size"}>
                    <SizeCreate id={editId} onClose={handleDialogClose}/>
                   </GenericDialog>
                    </>
                )}
            </Box>
        )
}
export default  SizeList;