import { Route, Routes } from "react-router-dom"
import OrderIndex from "./OrderIndex"

const OrderConfigRouter=()=>{
return (
     <Routes>
          <Route index element={<OrderIndex/>}/>         
     </Routes>
)
}

export default OrderConfigRouter