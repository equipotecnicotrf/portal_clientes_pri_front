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
import DropdownButton from 'react-bootstrap/DropdownButton';
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
        top: '10px',
        

    };
    const backgroundStyle = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', 
    };

    const data = [
        {
            Organización: 1, Nombre: 'Iniciar sesión'
        },
        {
            Organización: 2, Nombre: 'Cerrar sesión'
        }
    ];

    const audit = {
        padding: '10px',
        
    };

    const audit2 = {
        padding: '60px',
        height: '23vh',
        marginTop: '-35px'


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
                            <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestionar Usuario</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/Auditoria")}>Auditoria</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/Pedidos")}>Gestionar Pedidos</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate("/Inventario")}>Organización de Inventario</Dropdown.Item>
                            <Dropdown.Item href="#/action-5">Notificaciones</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>

                <div className='DataTable' style={bannerStyle}>
                    <th style={audit}>INVENTARIO </th>

                    
                        <Form inline />
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
                                    <Button className='auditoria'><FaSearch /></Button>
                                </Col>
                            </Row>
                        </Form>
                        </div>
                    

                    <table className='table table-borderless' style={bannerStyle} >

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
                                    <td style={bannerStyle}>{item.Organización}</td>
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
