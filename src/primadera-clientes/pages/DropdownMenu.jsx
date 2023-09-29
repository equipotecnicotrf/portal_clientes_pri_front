import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";

function AdminMenu() {
    const navigate = useNavigate();
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Acciones
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestionar usuarios</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Auditoria</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Gestionar pedidos</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Organización de Inventarios</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Notificaciones</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default AdminMenu;