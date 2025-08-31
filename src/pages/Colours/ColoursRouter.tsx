import { Route, Routes } from "react-router-dom"
import ColourList from "./ColourList"

const ColoursRouter=()=>{
    return(
        <Routes>
            <Route index element={<ColourList/>}/>
        </Routes>
    )
}
export default ColoursRouter;