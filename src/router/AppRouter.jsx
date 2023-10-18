import { Routes, Route } from "react-router-dom";
import HomePage from "../primadera-clientes/pages/HomePage";
import PrimaderaRoutes from "../primadera-clientes/routes/PrimaderaRoutes";
import UsuarioRoutes from '../primadera-usuario/usuario-routes/usuarioRoutes';

const AppRouter = () => {
  return (
    <>

      <Routes>


        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<PrimaderaRoutes />} />
        <Route path="/*" element={<UsuarioRoutes />} />






      </Routes>

    </>
  )
}

export default AppRouter;