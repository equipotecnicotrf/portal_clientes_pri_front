import { Route, Routes } from "react-router-dom"
import Dropdown from "../../primadera-clientes/pages/DropdownMenu";
import LoginPage from "../../auth/pages/LoginPage";
import GestionarUsuario from "../pages/GestionarUsuario";
import Auditoria from "../pages/Auditoria";
import Inventario from "../pages/Inventario";
import Pedidos from "../pages/Pedidos";
import DropdownMenu from "../pages/DropdownMenu"; {/*AJUSTE LCPG*/ }
import Notificaciones from "../pages/Notificaciones"; {/*AJUSTE LCPG*/ }
import DataTablePerfilUser from '../../primadera-usuario/pages-usuario/PerfilUsuario';
import DataInventario from '../../primadera-usuario/pages-usuario/InventarioUser';
import DataPedido from "../../primadera-usuario/pages-usuario/HazPedido";
import CarritoCompras from "../../primadera-usuario/pages-usuario/CarritoCompra";
import FinalizarCompra from '../../primadera-usuario/pages-usuario/FinalizarCompra';
import DataIva from '../pages/GestionarIva';
import GestionarConsecutivos from '../pages/GestionarConsecutivos';
import ConfirmarCorreo from "../../auth/pages/ConfirmarCorreo";
import ActualizarPassword from "../../auth/pages/ActualizarContraseña";

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
        <Route path="DataTablePerfilUser" element={<DataTablePerfilUser />} />
        {<Route path="DataInventario" element={<DataInventario />} />}
        <Route path="DataPedido" element={<DataPedido />} />
        <Route path="CarritoCompras" element={<CarritoCompras />} />
        <Route path="FinalizarCompra" element={<FinalizarCompra />} />
        <Route path="DataIva" element={<DataIva />} />
        <Route path="GestionarConsecutivos" element={<GestionarConsecutivos />} />
        <Route path="ConfirmarCorreo" element={<ConfirmarCorreo />} />
        <Route path="ActualizarPassword" element={<ActualizarPassword />} />

      </Routes>
    </>
  )
}

export default PrimaderaRoutes;