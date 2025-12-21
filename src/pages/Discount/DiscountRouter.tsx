import { Route, Routes } from "react-router-dom";
import DiscountList from "./DiscountList";
import DiscountCreate from "./DiscountCreate";
import DiscountEdit from "./DiscountEdit";

const DiscountRouterConfig=()=>{
    return(
        <Routes>
            <Route index element={<DiscountList/>}></Route>
            <Route
                    path="/create"
                    element={<DiscountCreate />}
                  />
                  <Route
                    path="/edit/:id"
                    element={<DiscountEdit  />}
                  />
        </Routes>
    )
}

export default DiscountRouterConfig;