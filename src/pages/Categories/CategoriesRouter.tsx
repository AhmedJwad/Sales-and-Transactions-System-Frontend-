import { Route, Routes } from "react-router-dom";

import CategoriesList from "./CategoriesList";
const CategoryConfigRouter = () => {
  return (
    <Routes>
      <Route index element={<CategoriesList/>}/>/
     
    </Routes>
  );
};

export default CategoryConfigRouter;