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
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './Login';
import RegisterForm from './pages/Register/RegisterForm';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail';
import ResetPassword from './pages/ResetPassword/ResetPassword';

function App() { 

  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>  
        <Route index element={<Dashboard />} /> 
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/login/" element={<Login/>} />
        <Route path="/api/Accounts/ConfirmEmail" element={<ConfirmEmail />} />
        <Route path="/recoverypassword/" element={<ResetPassword/>}/>
              <Route
                path="/Categories/*"
                element={
                   <PrivateRoute allowedRoles={["User", "Admin"]}>                
                   <CategoryConfigRouter/>
                   </PrivateRoute>                                 
                }
              />       
              <Route
                path="/SubCategories/*"
                element={ 
                  <PrivateRoute allowedRoles={["User", "Admin"]}>                
                  <SubcategoryConfigRouter/>
                  </PrivateRoute>                             
                }
              />     
              <Route
                path="/Brands/*"
                element={
                  <PrivateRoute allowedRoles={["User", "Admin"]}> 
                  <BrandConfigRouter/>
                  </PrivateRoute>
                }
              />  
              <Route
                path="/Products/*"
                element={
                   <PrivateRoute allowedRoles={["User", "Admin"]}> 
                  <ProductConfigRouter/>
                  </PrivateRoute>
                }
              />  
              <Route
                path="/Countries/"
                element={
                   <PrivateRoute allowedRoles={["User", "Admin"]}> 
                  <CountryConfigRouter/>
                  </PrivateRoute>
                }
              />
               <Route
                path="/States/"
                element={
                   <PrivateRoute allowedRoles={["User", "Admin"]}> 
                  <StateRouter/>
                  </PrivateRoute>
                }
              />
              <Route
                path="/Cities/"
                element={
                   <PrivateRoute allowedRoles={["User", "Admin"]}> 
                  <CitiesRouter/>
                  </PrivateRoute>
                }
              />              
        </Route>      
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  )
}

export default App
