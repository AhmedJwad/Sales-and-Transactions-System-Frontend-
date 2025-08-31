import { Route, Routes } from "react-router-dom";
import SizeList from "./SizeList";

const SizesRouter=()=>{
    return(
        <Routes>
            <Route index element={<SizeList/>}/>
        </Routes>
    )
}
export default SizesRouter;