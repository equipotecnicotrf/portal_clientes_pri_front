import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Pedidos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
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
        top: '10px'

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
    const data = [
        {
            descripcion: 'Nacional ', codigo: "12345", estado: 'Activo'
        },
        {
            descripcion: 'Exportación', codigo: "67890", estado: 'Activo'
        }
    ];

    const audit = {
        padding: '20px',
    };

    const audit2 = {
        padding: '60px',
        height: '23vh',
    };

    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />

                <div style={audit2}>
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
                        <td><th>ADMIN1 </th></td>
                    </tr>
                </div>

                <div style={{ position: 'relative' }}>
                    {/* Contenedor */}
                    <div >
                        {/* Coloca el DropdownButton en la esquina superior derecha */}
                        <DropdownButton
                            id="dropdown-button"
                            title="Opciones"
                            variant="secondary"
                            style={{ position: 'absolute', top: '15px', right: '1057px' }}
                        >
                            <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestión de usuarios</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/Auditoria")}>Auditoria</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/Pedidos")}>Gestionar Pedidos</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/Inventario")}>Organización de Inventario</Dropdown.Item>
                            <Dropdown.Item href="#/action-5">Notificaciones</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>

                <div className='DataTable' style={bannerStyle}>
                    <th style={audit}>PEDIDO</th>
                    <table className='table table-borderless' style={bannerStyle}>
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
                                        <label >
                                            <input type="checkbox" />
                                        </label>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                    
                </div>

                <div className="botones mt-12">
                        <tr>
                            <td> <Button className="boton1 p-2 m-2 btn-sm">Editar</Button></td>
                            <td> <Button className="boton2 p-2 m-2 btn-sm">Crear</Button></td>
                        </tr>
                    </div>

            </div>
        </>
    );

};

export default DataTable;