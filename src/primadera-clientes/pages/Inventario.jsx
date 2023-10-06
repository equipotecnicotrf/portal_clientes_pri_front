import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Inventario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaSearch } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import InvService from '../../services/InvService';
import UserService from '../../services/UserService';



const DataTable = ({ backgroundColor }) => {
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

    //Consulta Inventario
    const [inventary, SetInv] = useState([]);
    useEffect(() => {
        ListaInv()
    }, [])
    const ListaInv = () => {
        InvService.getAllInv().then(response => {
            SetInv(response.data)
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        })
    }

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
                        <td><th>{usuarioSesion}</th><tr><td>{usuarioCorreo}</td></tr></td>
                    </tr>
                </div>

                <Dropdown style={dropDown}>
                    <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
                        {selectedOption}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={dropDownbackgroundStyle}>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestión de usuarios'); navigate("/GestionarUsuario"); }}>Gestión de usuarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoria</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <div className='DataTable' style={bannerStyle}>
                    <th style={audit}>ORGANIZACIONES DE INVENTARIO </th>
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
                                <th style={bannerStyle}>Codigo Organización</th>
                                <th style={bannerStyle}>Nombre</th>
                                <th style={bannerStyle}>Estado</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {inventary
                                .toSorted((a, b) => a.organization_id - b.organization_id) // Ordena el arreglo por organization_id en orden ascendente
                                .map((inventary) => (
                                    <tr style={bannerStyle} key={inventary.organization_id}>
                                        <td style={bannerStyle}>{inventary.organization_id}</td>
                                        <td style={bannerStyle}>{inventary.organization_code}</td>
                                        <td style={bannerStyle}>{inventary.organization_name}</td>
                                        <td style={bannerStyle}>{inventary.organization_status}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <Image className='Img-Creamos_ped' src={imagenes.Creamos} />
            </div>{/*AJUSTE LCPG*/}
        </>
    );
};

export default DataTable;
