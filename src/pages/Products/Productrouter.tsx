import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductsList";



const ProductConfigRouter = () => {
  return (
    <Routes>
      <Route index element={<ProductList/>}/>/
     
    </Routes>
  );
};

export default ProductConfigRouter;