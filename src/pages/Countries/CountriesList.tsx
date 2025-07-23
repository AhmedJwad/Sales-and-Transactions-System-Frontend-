import { useEffect, useState } from "react"
import { CountryDto } from "../../types/CountryDto";
import genericRepository from "../../repositories/genericRepository";
import { Box } from "@mui/material";
import LoadingComponent from "../../components/LoadingComponent";
import DataGridCustom from "../../components/DataGridCustom";
import GenericDialog from "../../components/GenericDialog";
import CountryCreate from "./CountryCreate";


const CountriesLis=()=>{
    const [loading, setLoading]=useState(false);
    const [rows, setRows]=useState<CountryDto[]>([]);
    const [dialogOpen, setDialogOpen]=useState(false);
    const [editId, setEditId]=useState<number|null>(null)

    const columns=[
        {field: "name", headerName: "Name", flex: 6},
         {field: "statesNumber", headerName: "states Number", flex: 6}
    ]
    const repository=genericRepository<CountryDto[], CountryDto>("Countries");
    const getCountries=async()=>{
       setLoading(true);
       try {
        const data=await repository.getAll();
        if(!data.error && data.response)
        {
         const countries=data.response.map((item:CountryDto)=>({
             ...item,
             id:item.id,
         }));
         setRows(countries);
        }else{
          console.log(data.error);
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
           await repository.delete(id);
            await getCountries();                   
            } catch (error) {
                 console.log(error); 
            }finally{
                setLoading(false)
            }        
         }
         const  handleDialogClose=()=>{
            setDialogOpen(false);
            setEditId(null);
            getCountries();
         }
         useEffect(()=>{
            getCountries();
         },[])
         return (
            <Box>
                {loading?(<LoadingComponent/>):
                (
                    <>
                    <DataGridCustom
                    columns={columns}
                    rows={rows}
                    title="Countries"
                    filtercolumn={["name"]}
                    onDelete={handleDelete}
                    onCreateClick={()=>{
                        setEditId(null)
                        setDialogOpen(true)
                    }}
                    onEditClick={(id)=>{
                        setEditId(id)
                        setDialogOpen(true)
                    }}/>
                     <GenericDialog
                            open={dialogOpen}
                            onClose={handleDialogClose}
                            title={editId ? "Edit Country" : "Create Country"}
                        >
                            <CountryCreate id={editId} onClose={handleDialogClose} />
                        </GenericDialog>
                    </>
                )}
            </Box>
         )
}
export default CountriesLis;