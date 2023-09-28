import { Routes, Route } from "react-router-dom";
//import PrimaderaRoutes from '../primadera-clientes'

import HomePage from "../primadera-clientes/pages/HomePage";
import LoginPage from "../auth/pages/LoginPage";
//import { Navbar } from "../ui";


const AppRouter = () => {
  return (
    <>
   
    <Routes>
        
        <Route path="login" element={ <LoginPage/> } />
        <Route path="/" element={ <HomePage/> } />
        

        
        
        
        
      </Routes>

    </>
  )
}

export default AppRouter
