import { Route, Routes } from "react-router-dom"
import CitiesList from "./CitiesList";


const CitiesRouter=()=>{
    return(
        <Routes>
              <Route index element={<CitiesList/>}/>/
        </Routes>
    )
}

export default CitiesRouter;