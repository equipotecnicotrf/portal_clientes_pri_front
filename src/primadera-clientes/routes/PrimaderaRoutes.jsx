import { Route, Routes } from "react-router-dom"
import Dropdown from "../../primadera-clientes/pages/DropdownMenu";
import LoginPage from "../../auth/pages/LoginPage";
import GestionarUsuario from "../pages/GestionarUsuario";
import Auditoria from "../pages/Auditoria";
import Inventario from "../pages/Inventario";
import Pedidos from "../pages/Pedidos";




const PrimaderaRoutes = () => {
  return (
    <>
    <Routes>
        
        <Route path="login" element={ <LoginPage/> } />
        <Route path="Dropdown" element={ <Dropdown/> } />
        <Route path="GestionarUsuario" element={ <GestionarUsuario/> } />
        <Route path="Auditoria" element={<Auditoria />} />
        <Route path="Inventario" element={<Inventario /> } />
        <Route path="Pedidos" element={<Pedidos /> } />

        
        
        
      </Routes>
    </>
  )
}

export default PrimaderaRoutes;