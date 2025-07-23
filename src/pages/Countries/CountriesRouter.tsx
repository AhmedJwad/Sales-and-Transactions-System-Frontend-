import { Route, Routes } from "react-router-dom"
import CountriesLis from "./CountriesList"

const CountryConfigRouter=()=>{
    return(
        <Routes>
            <Route index element={<CountriesLis/>}/>
        </Routes>
    );

};
export default CountryConfigRouter