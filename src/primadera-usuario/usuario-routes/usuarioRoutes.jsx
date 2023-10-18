import { Route, Routes } from "react-router-dom"
import DataTablePerfilUser from '../pages-usuario/PerfilUsuario';
import HomePage from "../../primadera-clientes/pages/HomePage";
import DataInventario from "../pages-usuario/InventarioUser";
import DataPedido from "../pages-usuario/HazPedido";
import CarritoCompras from "../pages-usuario/CarritoCompra";


const UsuarioRoutes = () => {
    return (
        <>
            <Routes>

                <Route path="HomePage" element={<HomePage />} />
                <Route path="DataTablePerfilUser" element={<DataTablePerfilUser />} />
                <Route path="DataInventario" element={<DataInventario />} />
                <Route path="DataPedido" element={<DataPedido />} />
                <Route path="CarritoCompras" element={<CarritoCompras />} />

            </Routes>
        </>
    )
}

export default UsuarioRoutes;