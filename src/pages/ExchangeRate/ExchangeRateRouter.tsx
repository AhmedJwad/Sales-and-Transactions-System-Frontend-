import { Route, Routes } from "react-router-dom"
import ExchangeRateList from "./ExchangeRateList"

const ExchangeRateRouterConfig=()=>{
    return(
        <Routes>
            <Route index element={<ExchangeRateList/>}></Route>
        </Routes>
    )
}

export default ExchangeRateRouterConfig;