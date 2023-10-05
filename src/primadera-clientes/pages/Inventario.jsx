import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Inventario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaSearch } from "react-icons/fa";
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';



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
        height: '100vh',
    };

    const data = [
        {
            Organizacion: 1, Nombre: 'Iniciar sesión', Estado: 'Activo'
        },
        {
            Organizacion: 2, Nombre: 'Cerrar sesión', Estado: 'Activo'
        }
    ];

    const audit = {
        padding: '20px',

    };

    const audit2 = {
        padding: '60px',
        height: '23vh',
        marginTop: '-35px'
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

    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />

                <div style={audit2}>
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
                    <th style={audit}>INVENTARIO </th>
                    <div className='SearchInventario'>
                        <Form inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar"
                                        className="mr-sm-2"
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button className='inventario'><FaSearch /></Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                    <table className='table table-borderless'  >
                        <thead style={bannerStyle}>
                            <tr style={bannerStyle} >
                                <th style={bannerStyle}>Organización</th>
                                <th style={bannerStyle}>Nombre</th>
                                <th style={bannerStyle}>Estado</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {data.map((item) => (
                                <tr style={bannerStyle} key={item}>
                                    <td style={bannerStyle}>{item.Organizacion}</td>
                                    <td style={bannerStyle}>{item.Nombre}</td>
                                    <td style={bannerStyle}>{item.Estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

};

export default DataTable;
