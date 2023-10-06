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
  top: '37%',
  left: '14.5%',
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

const img_creamos = {
  padding: '70px',
  height: '5vh',
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
        //console.log(responseid.data)
        setUarioSesion(responseid.data.cp_name);
        setUsuarioCorreo(responseid.data.username);

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
        <div style={dropdown_principal}>
          <tr>
            <td><Container>
              <Row>
                <Col xs={6} md={4}>
                  <Image className='Img-Admin' src={imagenes.Arboles} roundedCircle />
                </Col>
              </Row>
            </Container>
            </td>
            <td><th>{usuarioSesion}</th><tr><td>{usuarioCorreo}</td></tr></td>

          </tr>

        </div>
        <div className='fondoBlanco'>

          <Dropdown style={dropDown}>
            <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
              {selectedOption}
            </Dropdown.Toggle>
            <Dropdown.Menu style={backgroundStyle}>
              <Dropdown.Item onClick={() => { setSelectedOption('Gestión de usuarios'); navigate("/GestionarUsuario"); }}>Gestión de usuarios</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoria</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item> {/*AJUSTE LCPG*/}
              <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>  {/*AJUSTE LCPG*/}
              <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Image className='Img-Creamos' src={imagenes.Creamos} /> {/*AJUSTE LCPG*/}
      </div>
    </>
  );
}

export default AdminMenu;