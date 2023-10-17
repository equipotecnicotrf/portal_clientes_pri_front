import { Route, Routes } from "react-router-dom"
import Dropdown from "../../primadera-clientes/pages/DropdownMenu";
import LoginPage from "../../auth/pages/LoginPage";
import GestionarUsuario from "../pages/GestionarUsuario";
import Auditoria from "../pages/Auditoria";
import Inventario from "../pages/Inventario";
import Pedidos from "../pages/Pedidos";
import DropdownMenu from "../pages/DropdownMenu"; {/*AJUSTE LCPG*/ }
import Notificaciones from "../pages/Notificaciones"; {/*AJUSTE LCPG*/ }
import ConfirmarCorreo from "../../auth/pages/ConfirmarCorreo"; {/*AJUSTE LCPG*/ }
import ActualizarContraseña from "../../auth/pages/ActualizarContraseña"; {/*AJUSTE LCPG*/ }

const PrimaderaRoutes = () => {
  return (
    <>
      <Routes>

        <Route path="login" element={<LoginPage />} />
        <Route path="Dropdown" element={<Dropdown />} />
        <Route path="GestionarUsuario" element={<GestionarUsuario />} />
        <Route path="Auditoria" element={<Auditoria />} />
        <Route path="Inventario" element={<Inventario />} />
        <Route path="Pedidos" element={<Pedidos />} />
        <Route path="DropdownMenu" element={<DropdownMenu />} />     {/*AJUSTE LCPG*/}
        <Route path="Notificaciones" element={<Notificaciones />} />     {/*AJUSTE LCPG*/}
        <Route path="ConfirmarCorreo" element={<ConfirmarCorreo />} />     {/*AJUSTE LCPG*/}
        <Route path="ActualizarContrasena" element={<ActualizarContraseña />} />     {/*AJUSTE LCPG*/}
      </Routes>
    </>
  )
}

export default PrimaderaRoutes;