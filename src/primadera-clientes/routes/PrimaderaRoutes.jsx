import { Route, Routes } from "react-router-dom"
import Dropdown from "../../primadera-clientes/pages/DropdownMenu";
import LoginPage from "../../auth/pages/LoginPage";
import GestionarUsuario from "../pages/GestionarUsuario";



const PrimaderaRoutes = () => {
  return (
    <>
    <Routes>
        
        <Route path="login" element={ <LoginPage/> } />
        <Route path="Dropdown" element={ <Dropdown/> } />
        <Route path="GestionarUsuario" element={ <GestionarUsuario/> } />

        
        
        
      </Routes>
    </>
  )
}

export default PrimaderaRoutes;