import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Auditoria.css';
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
        marginTop: '30px'

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

    const audit = {
        padding: '20px',
    };

    const audit2 = {
        padding: '60px',
        height: '23vh',
        marginTop: '-35px'

    };

    const data = [
        {
            id: 1, descripcion: 'Iniciar sesión', fecha_hora: "03-10-2023", editado_por: 'ADMIN 1'
        },
        {
            id: 2, descripcion: 'Cerrar sesión', fecha_hora: "03-10-2023", editado_por: 'ADMIN 1'
        }
    ];

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
                    <th style={audit}>AUDITORIA </th>
                    <div className="SearchAuditoria">
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
                    </div>
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
