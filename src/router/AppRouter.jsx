import { Routes, Route } from "react-router-dom";
import HomePage from "../primadera-clientes/pages/HomePage";
import PrimaderaRoutes from "../primadera-clientes/routes/PrimaderaRoutes";

//import { Navbar } from "../ui";


const AppRouter = () => {
  return (
    <>
   
    <Routes>
        
        
        <Route path="/" element={ <HomePage/> } />
        <Route path="/*" element={ <PrimaderaRoutes/> } />
        

        
        
        
        
      </Routes>

    </>
  )
}

export default AppRouter;