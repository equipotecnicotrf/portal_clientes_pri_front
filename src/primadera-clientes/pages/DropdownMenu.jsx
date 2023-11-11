import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/DropdownMenu.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import LoginService from '../../services/LoginService';
import Cookies from 'js-cookie';
import UserService from '../../services/UserService';

const backgroundStyle = {
  backgroundColor: 'white',
  color: 'Black',
  borderRadius: '10px',
  borderColor: 'Black',
  width: '250px'
};
const dropDown = {
  position: 'absolute',
  top: '235px',
  left: '14%',
  transform: 'translate (-50%, -50%)',
};
const backgroundS = {
  backgroundImage: `url(${imagenes.fondoTextura}`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
};

const dropdown_principal = {
  padding: '70px',
  height: '23vh',
  marginTop: '-47px',
};

const dropDownbackgroundStyle = {
  backgroundColor: 'white',
  color: 'Black',
  borderRadius: '10px',
  borderColor: 'Black',
  width: '250px'
};

function AdminMenu() {
  const [selectedOption, setSelectedOption] = useState('Acciones');
  //validacion de sesion activa
  const [usuarioSesion, setUarioSesion] = useState([]);
  const [usuarioCorreo, setUsuarioCorreo] = useState([]);
  const [usuariotelefono, setUsuarioTelefono] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    SesionUsername()
  }, [])

  const SesionUsername = () => {
    if (LoginService.isAuthenticated()) {
      // Renderizar la vista protegida
      const read = Cookies.get()
      //console.log(read)
      //alert("Bienvenido " + read.portal_sesion);    
      UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
        console.log(responseid.data)
        setUarioSesion(responseid.data.cp_name);
        setUsuarioCorreo(responseid.data.username);
        setUsuarioTelefono(responseid.data.cp_cell_phone);

      }).catch(error => {
        console.log(error)
        alert("Error obtener usuario de sesion")
      })
    } else {
      // Redirigir al inicio de sesión u otra acción
      LoginService.logout();
      navigate('/')
    }
  }

  return (
    <>

      <div className='Back' style={backgroundS}>
        <Banner />
        <div style={dropdown_principal} className='perfil_inv'>
          <tr>
            <td style={{ verticalAlign: 'middle' }}><Container>
              <Row>
                <Col xs={6} md={4}>
                  <Image className='Img_DatosInv' src={imagenes.Arboles} roundedCircle />
                </Col>
              </Row>
            </Container>
            </td>
            <td>
              <tr><th style={{ fontFamily: 'Bold', fontSize: '14px' }}>{usuarioSesion}</th></tr>

              <tr style={{ fontFamily: 'Ligera', fontSize: '14px' }}>{usuarioCorreo}</tr>
              <tr style={{ fontFamily: 'Ligera', fontSize: '14px' }}>{usuariotelefono}</tr>
            </td>
          </tr>
        </div>

        <div className='fondoBlanco'>
          <Dropdown style={dropDown}>
            <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
              {selectedOption}
            </Dropdown.Toggle>
            <Dropdown.Menu style={backgroundStyle}>
              <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoría</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Consecutivos'); navigate("/GestionarConsecutivos"); }}>Gestionar Consecutivos</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Iva'); navigate("/DataIva"); }}>Gestionar Iva</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Promesas'); navigate("/Promesas"); }}>Gestionar Promesas</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Image className='Img-Creamos' src={imagenes.Creamos} />
      </div>
    </>
  );
}

export default AdminMenu;