import { useEffect, useState } from "react"
import genericRepository from "../../repositories/genericRepository";
import { ColourDTO } from "../../types/ColoutDTO";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import ColourCreate from "./ColourCreate";

const ColourList=()=>{
    const [loading , setloaing]=useState(false);
    const [colour, setColour]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setdEditId]=useState<number | null>(null);
    const column=[
        {field:"name" , headerName:"Name", flex:3 },
        {field:"hexCode" , headerName:"Color", flex:3,
            renderCell: (params: any) => (
                <Box
                    sx={{
                    width: 40,
                    height: 20,
                    borderRadius: "4px",
                    backgroundColor: params.value, 
                    border: "1px solid #ccc",
                    }}
                    title={params.value} 
                />
                ),
        }
    ]
    const repository=genericRepository<ColourDTO[], ColourDTO>("colours");
    const getColours=async()=>{
        try {
            setloaing(true);
            const result=await repository.getAll();
            if(!result.error && result.response)  
            {
                const colors=result.response.map((item:ColourDTO)=>({
                    ...item,
                    id:item.id,
                    productImage:item.productImage || "N/A",
                    productColor:item.productColor ||"N/A",
                }))
                setColour(colors);                
            } else
            {
                console.log("error fetch colours", result.message)
            }         
        } catch (error) {
            console.log("Error:", error)
        }finally
        {
            setloaing(false)
        }
    }
    const handleDelete=async(id:number)=>{
        try {
            setloaing(true);
            const result=await repository.delete(id);
            if(result.error)
            {
               await getColours();
            } else
            {
                 console.error("Delete failed:", result.message || "Unknown error");
            }          
        } catch (error) {
            console.log("Error:", error)
        } finally{
            setloaing(false);
        }      
    }
    const handleDialogClose=()=>{
        setDialogOpen(false);
        setdEditId(null);
        getColours();
    }
    useEffect(()=>{
        getColours();
    },[])
    return(
        <Box>
            {loading?(<LoadingComponent/>):(
                <>
                <DataGridCustom
                title="Colors"
                columns={column}
                rows={colour}
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
                  <GenericDialog open={dialogOpen} onClose={handleDialogClose} title={editId? "Edit Color" : "Create Color"}>         
                    <ColourCreate id={editId} onClose={handleDialogClose}/>
                </GenericDialog>
                </>
            )}
        </Box>
    )

}
export default ColourList;