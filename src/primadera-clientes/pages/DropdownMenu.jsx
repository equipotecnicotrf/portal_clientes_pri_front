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
import AccessService from '../../services/AccessService';

const backgroundStyle = {
  backgroundColor: 'white',
  color: 'Black',
  borderRadius: '10px',
  borderColor: 'Black',
  width: '250px'
};

const backgroundS = {
  backgroundImage: `url(${imagenes.fondoTextura}`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
};

const dropdown_principal = {
  padding: '60px',
};

const dropDownbackgroundStyle = {
  backgroundColor: 'white',
  color: 'Black',
  borderRadius: '8px',
  borderColor: 'rgb(185 185 185)',
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

        ListSeguridad(responseid.data.cp_rol_id);
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

  // consulta de contextos
  const [seguridad, setSeguridad] = useState([]);
  const ListSeguridad = (cp_rol_id) => {
    AccessService.getAllAccessAndContext(cp_rol_id).then(responsecontext => {
      setSeguridad(responsecontext.data);
      console.log(responsecontext.data);
    }).catch(error => {
      console.log(error);
    })
  };

  const hasAccess = (cp_context_id) => {
    const seguridadItem = seguridad.find((item) => item[0].cp_context_id === cp_context_id);
    return seguridadItem && seguridadItem[0].cp_access_assign === 1;
  };

  return (
    <>

      <div className='Back' style={backgroundS}>
        <Banner />


        <div className='fondoBlanco_menu'>
          <div style={dropdown_principal} className='perfil_drop'>
            <tr>
              <td style={{ verticalAlign: 'middle' }}><Container>
                <Row>
                  <Col xs={6} md={4}>
                    <Image className='Img-Admin-Dropdown' src={imagenes.Arboles} roundedCircle />
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
          <Dropdown className='div_drop'>
            <Dropdown.Toggle style={dropDownbackgroundStyle} id="DropdownMenu">
              {selectedOption}
            </Dropdown.Toggle>
            <Dropdown.Menu style={backgroundStyle}>
              {hasAccess(1) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoría</Dropdown.Item>
              )}
              {hasAccess(2) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Consecutivos'); navigate("/GestionarConsecutivos"); }}>Gestionar Consecutivos</Dropdown.Item>
              )}
              {hasAccess(3) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Iva'); navigate("/DataIva"); }}>Gestionar Iva</Dropdown.Item>
              )}
              {hasAccess(4) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Promesas'); navigate("/Promesas"); }}>Gestionar Promesas</Dropdown.Item>
              )}
              {hasAccess(5) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
              )}
              {hasAccess(6) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
              )}
              {hasAccess(7) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
              )}
              {hasAccess(8) && (
                <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Image className='Img-Creamos_drop' src={imagenes.Creamos} />
      </div>
    </>
  );
}

export default AdminMenu;