import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";

const backgroundStyle = {
  backgroundColor: 'white',
  color: 'Black',
  borderRadius: '10px',
  borderColor: 'Black',
  width: '400px'
};
const backgroundS = {
  backgroundImage: `url(${imagenes.fondoTextura}`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh', 
};
const dropDown ={
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate (-50%, -50%)',
   
};

function AdminMenu() {
  const navigate = useNavigate();
  return (
    <>
    <div className='Back' style={backgroundS}>
      <Banner />
      <Dropdown style={dropDown}>
        <Dropdown.Toggle style={backgroundStyle} id="dropdown-basic">
          Acciones
        </Dropdown.Toggle>

        <Dropdown.Menu style={backgroundStyle}>
          <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestion de usuarios</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Auditoria</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestionar Pedidos</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Organización de Inventarios</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Notificaciones</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </div>
    </>
  );
}

export default AdminMenu;