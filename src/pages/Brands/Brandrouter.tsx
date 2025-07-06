import { Route, Routes } from "react-router-dom";
import BrandsList from "./BrandsList";



const BrandConfigRouter = () => {
  return (
    <Routes>
      <Route index element={<BrandsList/>}/>/
     
    </Routes>
  );
};

export default BrandConfigRouter;