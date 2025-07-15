import { Route, Routes } from "react-router-dom";
import SubcategoriesList from "./SubcategoriesList";


const SubcategoryConfigRouter = () => {
  return (
    <Routes>
      <Route index element={<SubcategoriesList/>}/>/
  
    </Routes>
  );
};

export default SubcategoryConfigRouter;