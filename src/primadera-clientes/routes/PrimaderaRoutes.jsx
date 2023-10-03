import { Route, Routes } from "react-router-dom"
import Dropdown from "../../primadera-clientes/pages/DropdownMenu";
import LoginPage from "../../auth/pages/LoginPage";
import GestionarUsuario from "../pages/GestionarUsuario";
import Auditoria from "../pages/Auditoria";




const PrimaderaRoutes = () => {
  return (
    <>
    <Routes>
        
        <Route path="login" element={ <LoginPage/> } />
        <Route path="Dropdown" element={ <Dropdown/> } />
        <Route path="GestionarUsuario" element={ <GestionarUsuario/> } />
        <Route path="Auditoria" element={<Auditoria />} />

        
        
        
      </Routes>
    </>
  )
}

export default PrimaderaRoutes;