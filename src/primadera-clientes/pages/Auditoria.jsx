import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/GestionarUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import { FaSearch } from "react-icons/fa";
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';



const DataTable = ({ backgroundColor }) => {
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
        height: '100vh', // Altura de la pantalla completa
    };

    const data = [
        {
            id: 1, descripcion: 'Iniciar sesión', fecha_hora: "03-10-2023", editado_por: 'ADMIN 1'
        },
        {
            id: 2, descripcion: 'Cerrar sesión', fecha_hora: "03-10-2023", editado_por: 'ADMIN 1'
        }
    ];


    const audit = {
        padding: '20px',
    };

    const audit2 = {
        padding: '70px',

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
                                    <Image src="../assets/PLANTA_HOME.jpg" roundedCircle />
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
                            style={{ position: 'absolute', top: '-60px', right: '1000px' }}
                        >
                            <Dropdown.Item href="#/action-1">Gestionar Usuario</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Auditoria</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Gestionar Pedidos</Dropdown.Item>
                            <Dropdown.Item href="#/action-4">Organización de Inventario</Dropdown.Item>
                            <Dropdown.Item href="#/action-5">Notificaciones</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>

                <div className='DataTable' style={bannerStyle}>
                    <th style={audit}>AUDITORIA </th>

                    <Navbar className="bg-body-tertiary justify-content-between">
                        <Form inline />
                        <Form inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar"
                                        className=" mr-sm-2"
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button className='auditoria'><FaSearch /></Button>
                                </Col>
                            </Row>
                        </Form>
                    </Navbar>

                    <table className='table table-borderless' style={bannerStyle} >

                        <thead style={bannerStyle}>
                            <tr style={bannerStyle} >
                                <th style={bannerStyle}>ID</th>
                                <th style={bannerStyle}>Descripción</th>
                                <th style={bannerStyle}>Fecha/Hora</th>
                                <th style={bannerStyle}>Editado por</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {data.map((item) => (
                                <tr style={bannerStyle} key={item.id}>
                                    <td style={bannerStyle}>{item.id}</td>
                                    <td style={bannerStyle}>{item.descripcion}</td>
                                    <td style={bannerStyle}>{item.fecha_hora}</td>
                                    <td style={bannerStyle}>{item.editado_por}</td>
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
