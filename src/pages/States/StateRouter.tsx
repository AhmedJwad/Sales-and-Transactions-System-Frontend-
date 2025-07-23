import { Route, Routes } from "react-router-dom"
import StatesList from "./StatesList"

const StateRouter=()=>{
    return(
        <Routes>
              <Route index element={<StatesList/>}/>/
        </Routes>
    )
}

export default StateRouter;