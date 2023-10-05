import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/DropdownMenu.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';


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
function AdminMenu() {
  const navigate = useNavigate();
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
            <td><th>ADMIN1 </th><tr><td>Correo</td></tr></td>
            
          </tr>
         
          </div>
        <div className='fondoBlanco'>
       
        <Dropdown style={dropDown}>
          <Dropdown.Toggle style={backgroundStyle} id="dropdown-basic">
            Acciones
          </Dropdown.Toggle>
          <Dropdown.Menu style={backgroundStyle}>
            <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestión de usuarios</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/Auditoria")}>Auditoria</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/Pedidos")}>Gestionar Pedidos</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/Inventario")}>Organización de Inventarios</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Notificaciones</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
        </div> 
        <div style={img_creamos}>
          <tr>
            <td><Container>
              <Row>
                <Col xs={6} md={4}>
                  <Image className='Img-Creamos' src={imagenes.Creamos}   />
                </Col>
              </Row>
            </Container>
            </td>            
          </tr>
          </div>
        </div>
    </>
  );
}

export default AdminMenu;