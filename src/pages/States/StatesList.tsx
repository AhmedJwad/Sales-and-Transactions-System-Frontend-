import { useEffect, useState } from "react"
import genericRepository from "../../repositories/genericRepository";
import { StateDto } from "../../types/StateDto";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import StateCreate from "./StateCreate";


const StatesList=()=>{
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<any[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number|null>(null);

    const columns=[
        // {field: "id", headerName: "ID", flex: 1},
        {field: "name", headerName: "Name", flex: 3 },
       /*  {
           field: "cities",
          headerName: "Cities",
          flex: 6,
          renderCell: (params: any) =>
            params.row.cities && Array.isArray(params.row.cities)
              ? params.row.cities.map((c: any) => c.name).join(", ")
              : "No Cities"
        }, */
         {field: "country", headerName: "Country", flex: 3 }, 
        {field: "cityNumber", headerName: "City Number", flex: 1 },        
    ]
    const repository=genericRepository<StateDto[], StateDto>("State"); 
    const getStates=async()=>{
        setLoading(true);
        try {
            const data=await repository.getAll();
            if(!data.error && data.response) 
            {
             const states= data.response.map((item:StateDto)=>({
                ...item,
                id:item.id,
               cityNumber:item.cityNumber || 0,
               cities: item.cities ?? [],
               country:item.country?.name || "N/A"
             }));
             setRows(states);
            }else{
                console.error("Error Fetch States:", data.error)
            }         
        } catch (error) {
            console.log(error);            
        }finally{
            setLoading(false);
        }
    } 
    const handleDelete=async(id:number)=>{
        try {
            setLoading(true);
             const result= await repository.delete(id);
                if(!result.error)
                {
                await getStates();
                }else
                {
                console.error("Delete failed:", result.message || "Unknown error");
                }                 
        } catch (error:any) {
             console.error("Unexpected error during delete:", error.message || error);
        }finally{
            setLoading(false);
        }
    }  
     const handleDialogClose = () => {
    setDialogOpen(false);
    setEditId(null);
    getStates();
  };
  useEffect(()=>
    {
        getStates();
    },[]);
    return (
    <Box>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <DataGridCustom
            columns={columns}
            rows={rows}
            title="States"
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
                      title={editId ? "Edit State" : "Create State"}
                    >
                      <StateCreate id={editId} onClose={handleDialogClose} />
                    </GenericDialog>        
        </>
      )}
    </Box>
  );
}
export default StatesList;