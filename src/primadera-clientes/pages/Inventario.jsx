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



const DataTable_inve = ({ backgroundColor }) => {
    const [selectedOption, setSelectedOption] = useState('Acciones');
    const [usuarioSesion, setUsuarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuariotelefono, setUsuarioTelefono] = useState([]);
    const [inventary, setInventary] = useState([]);
    const [searchText, setSearchText] = useState(''); // Nuevo estado para el texto de búsqueda
    const navigate = useNavigate();

    useEffect(() => {
        SesionUsername();
        ListaInv();
    }, []);

    const SesionUsername = () => {
        if (LoginService.isAuthenticated()) {
            const read = Cookies.get();
            UserService.getUserByUsername(read.portal_sesion)
                .then((responseid) => {
                    setUsuarioSesion(responseid.data.cp_name);
                    setUsuarioCorreo(responseid.data.username);
                    setUsuarioTelefono(responseid.data.cp_cell_phone);
                })
                .catch((error) => {
                    console.error(error);
                    alert('Error obteniendo usuario de sesión');
                });
        } else {
            LoginService.logout();
            navigate('/');
        }
    };

    const ListaInv = () => {
        InvService.getAllInv()
            .then((response) => {
                setInventary(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Función para filtrar organizaciones de inventario según el texto de búsqueda
    const filterInventary = () => {
        return inventary.filter((item) => {
            const itemText = `${item.organization_id} ${item.organization_code} ${item.organization_name} ${item.organization_status}`;
            return itemText.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',


    };

    const bannerStyle9 = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        textAlign: 'center',
        marginTop: '50px' //31-10-2023 se ajusta
    }
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


    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />

                <div className='Datos_Aud' style={audit2}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div className='ubica_imagen_audit' >
                                        <Container>
                                            <Row>
                                                <Col xs={6} md={4}>
                                                    <Image className='Img-Admin-audit' src={imagenes.Arboles} roundedCircle />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </td>
                                <td>
                                    <div className='ubica_datos_audit'>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th className='Datos' style={{ fontFamily: 'Bold', fontSize: '14px' }}>{usuarioSesion}</th>
                                                </tr>
                                                <tr>
                                                    <td className='Datos' style={{ fontFamily: 'Ligera', fontSize: '14px' }}>{usuarioCorreo}</td>
                                                </tr>
                                                <tr>
                                                    <td className='Datos' style={{ fontFamily: 'Ligera', fontSize: '14px' }}>{usuariotelefono}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <Dropdown className='boton_inventario' >
                    <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
                        {selectedOption}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={dropDownbackgroundStyle}>
                        <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoría</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Consecutivos'); navigate("/GestionarConsecutivos"); }}>Gestionar Consecutivos</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Iva'); navigate("/DataIva"); }}>Gestionar Iva</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Promesas'); navigate("/Promesas"); }}>Gestionar Promesas</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <div className='DataTable_inve' style={bannerStyle}>
                    <th style={audit}>ORGANIZACIONES DE INVENTARIO </th>
                    <div className='SearchInventario'>
                        <Form inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar"
                                        className="mr-sm-2"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button className='inventario'><FaSearch /></Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                    <table className='table table-bordered' style={bannerStyle9} >
                        <thead style={bannerStyle}>
                            <tr style={bannerStyle} className='borderless_inv' >
                                <th style={bannerStyle} className='borderless_inv'>Organización</th>
                                <th style={bannerStyle}>Código Organización</th>
                                <th style={bannerStyle}>Nombre</th>
                                <th style={bannerStyle} className='borderless_inv'>Estado</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {filterInventary().map((item) => (
                                <tr style={bannerStyle} className='borderless_inv' key={item.organization_id}>
                                    <td style={bannerStyle}>{item.organization_id}</td>
                                    <td style={bannerStyle}>{item.organization_code}</td>
                                    <td style={bannerStyle}>{item.organization_name}</td>
                                    <td style={bannerStyle}>{item.organization_status}</td>
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

export default DataTable_inve;