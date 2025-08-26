import {  createContext, ReactNode, useContext, useState } from "react";

type CategoryContextType={
     categoryId:number |null;
     setCategoryId:(id:number)=>void;
}
const CategoryContext=createContext<CategoryContextType |undefined>(undefined);
export const CategoryProvider=({children}:{children:ReactNode})=>{
     const [categoryId, setCategoryId] = useState<number | null>(null);
     return(
        <CategoryContext.Provider value={{categoryId, setCategoryId}}>
            {children}
        </CategoryContext.Provider>
     )
     
}
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategory must be used inside CategoryProvider");
  return context;
};
