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
import RecoveryPassword from './pages/ResetPassword/RecoveryPassword';
import EditProfileForm from './pages/EditProfile/EditProfileForm';
import HomeLayout from './pages/Home/HomeLayout';
import Home from './pages/Home/Home';
import Products from './pages/Home/Products/Products';
import ColoursRouter from './pages/Colours/ColoursRouter';
import SizesRouter from './pages/Sizes/SizesRouter';
import PublicProductList from './pages/Home/Products/PublicProductList';
import Cart from './pages/Home/Cart/Cart';
import ContinueShopping from './pages/Home/ReturnShopping/ContinueShopping';

function App() { 

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>  
          {/* Home layout */}
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />       
            <Route path="login" element={<Login />} />   
            <Route path="homeproducts" element={<PublicProductList/>}/>     
            <Route path="homeproducts/:subcategoryId" element={<Products/>}/>
            <Route path="register" element={<RegisterForm/>}/>
             <Route path="/cart" element={<Cart />} />
             <Route path="/editprfile" element={<EditProfileForm/>}/>
             <Route path="/ContinueShopping" element={<ContinueShopping/>}/>
          </Route>     
          
          {/* Admin layout */}
          <Route path="/admin" element={<Layout />}>  
            <Route index element={<Dashboard />} />             
            <Route path="login" element={<Login/>} />       
            <Route path="categories/*" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}>                
                <CategoryConfigRouter/>
              </PrivateRoute>                                 
            } />       
            <Route path="subcategories/*" element={ 
              <PrivateRoute allowedRoles={["User", "Admin"]}>                
                <SubcategoryConfigRouter/>
              </PrivateRoute>                             
            } />     
            <Route path="brands/*" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}> 
                <BrandConfigRouter/>
              </PrivateRoute>
            } />  
            <Route path="products/*" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}> 
                <ProductConfigRouter/>
              </PrivateRoute>
            } />  
            <Route path="countries/*" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}> 
                <CountryConfigRouter/>
              </PrivateRoute>
            } />
            <Route path="states/*" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}> 
                <StateRouter/>
              </PrivateRoute>
            } />
            <Route path="cities/*" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}> 
                <CitiesRouter/>
              </PrivateRoute>
            } />
            <Route path="edituser" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}>
                <EditProfileForm/>
              </PrivateRoute>
            } />
            <Route path="colors/" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}>
                <ColoursRouter/>
              </PrivateRoute>
            }/>
            <Route path="Sizes/" element={
              <PrivateRoute allowedRoles={["User", "Admin"]}>
                <SizesRouter/>
              </PrivateRoute>
            }/>
          </Route>

       
          <Route path="/api/Accounts/ConfirmEmail" element={<ConfirmEmail />} />
          <Route path="/api/Accounts/ResetPassword" element={<RecoveryPassword />} />
          <Route path="/recoverypassword" element={<ResetPassword/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App