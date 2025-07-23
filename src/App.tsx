import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from "./components/Layout";
import Dashboard from './components/Dashboard';
import CategoryConfigRouter from './pages/Categories/CategoriesRouter';
import SubcategoryConfigRouter from './pages/Subcategories/Subcategoriesrouter';
import BrandConfigRouter from './pages/Brands/Brandrouter';
import ProductConfigRouter from './pages/Products/Productrouter';
import CountryConfigRouter from './pages/Countries/CountriesRouter';
import StateRouter from './pages/States/StateRouter';
import CitiesRouter from './pages/Cities/CitiesRouter';

function App() { 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>  
        <Route index element={<Dashboard />} /> 
              <Route
                path="/Categories/*"
                element={                 
                   <CategoryConfigRouter/>                 
                }
              />       
              <Route
                path="/SubCategories/*"
                element={                 
                  <SubcategoryConfigRouter/>                 
                }
              />     
              <Route
                path="/Brands/*"
                element={
                  <BrandConfigRouter/>
                }
              />  
              <Route
                path="/Products/*"
                element={
                  <ProductConfigRouter/>
                }
              />  
              <Route
                path="/Countries/"
                element={
                  <CountryConfigRouter/>
                }
              />
               <Route
                path="/States/"
                element={
                  <StateRouter/>
                }
              />
              <Route
                path="/Cities/"
                element={
                  <CitiesRouter/>
                }
              />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
