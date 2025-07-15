import { Route, Routes } from "react-router-dom";
import ProductCreate from "./Productcreate";
import ProductList from "./ProductsList";



const ProductConfigRouter = () => {
  return (
    <Routes>
      <Route index element={<ProductList/>}/>
      <Route
        path="/create"
        element={<ProductCreate />}
      />
      <Route
        path="/edit/:id"
        element={<ProductCreate  />}
      />
     
    </Routes>
  );
};

export default ProductConfigRouter;