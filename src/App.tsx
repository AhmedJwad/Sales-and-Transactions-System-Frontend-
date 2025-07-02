import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from "./components/Layout";
import Dashboard from './components/Dashboard';
import CategoryConfigRouter from './pages/Categories/CategoriesRouter';
import SubcategoryConfigRouter from './pages/Subcategories/Subcategoriesrouter';

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
