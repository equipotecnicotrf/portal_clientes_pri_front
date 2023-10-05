import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Pedidos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { useNavigate } from "react-router-dom";

const DataTable = ({ backgroundColor }) => {
    const navigate = useNavigate();
    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '30px',
    };
    
    const backgroundStyle = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    };

    const dropDownbackgroundStyle = {
        backgroundColor: 'white',
        color: 'Black',
        borderRadius: '10px',
        borderColor: 'Black',
        width: '250px'
    };
    const dropDown = {
        position: 'absolute',
        top: '27.2%',
        left: '75%',
        transform: 'translate (-50%, -50%)',

    };

    const pedido = {
        padding: '20px',
    };

    const pedido2 = {
        padding: '60px',
        height: '23vh',
        marginTop: '-35px'
    };

    const data = [
        {
            descripcion: 'Nacional ', codigo: "12345", estado: 'Activo'
        },
        {
            descripcion: 'Exportación', codigo: "67890", estado: 'Activo'
        }
    ];


    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />

                <div style={pedido2}>
                    <tr>
                        <td >
                            <Container >
                                <Row>
                                    <Col xs={2} md={2} >
                                        <Image className='imagen-circular' src={imagenes.Arboles} roundedCircle />
                                    </Col>
                                </Row>
                            </Container>
                        </td>
                        <td><th>ADMIN1 </th><tr><td>Correo</td></tr></td>
                    </tr>
                </div>

                <Dropdown style={dropDown}>
                    <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
                        Acciones
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={dropDownbackgroundStyle}>
                        <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestión de usuarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate("/Auditoria")}>Auditoria</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate("/Pedidos")}>Gestionar Pedidos</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate("/Inventario")}>Organización de Inventarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Notificaciones</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <div className='DataTable' style={bannerStyle}>
                    <th style={pedido}>PEDIDO</th>
                    <table className='table table-borderless' >
                        <thead style={bannerStyle}>
                            <tr style={bannerStyle} >
                                <th style={bannerStyle}>Descripción</th>
                                <th style={bannerStyle}>Código</th>
                                <th style={bannerStyle}>Estado</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {data.map((item) => (
                                <tr style={bannerStyle} key={item.codigo}>
                                    <td style={bannerStyle}>{item.descripcion}</td>
                                    <td style={bannerStyle}>{item.codigo}</td>
                                    <td style={bannerStyle}>{item.estado}                        
                                      <label>
                                            <input type="checkbox" />
                                      </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                    <div className="botones mt-12">
                        <tr>
                            <td> <Button className="boton1 p-2 m-2 btn-sm">Editar</Button></td>
                            <td> <Button className="boton2 p-2 m-2 btn-sm">Crear</Button></td>
                        </tr>
                    </div>
                </div>
            </div>
        </>
    );

};

export default DataTable;