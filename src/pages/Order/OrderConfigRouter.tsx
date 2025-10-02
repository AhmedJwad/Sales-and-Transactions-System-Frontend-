import { Route, Routes } from "react-router-dom"
import OrderIndex from "./OrderIndex"
import OrderDetails from "./OrderDetails"

const OrderConfigRouter=()=>{
return (
     <Routes>
          <Route index element={<OrderIndex/>}/>         
          <Route path="/orderdetails/:id" element={<OrderDetails />} />
     </Routes>
)
}

export default OrderConfigRouter