import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Auditoria.css';
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
import AuditService from '../../services/AuditService';
import LoginService from '../../services/LoginService';
import UserService from '../../services/UserService';



const DataTable = ({ backgroundColor }) => {
    const [selectedOption, setSelectedOption] = useState('Acciones');
    const [usuarioSesion, setUsuarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuariotelefono, setUsuarioTelefono] = useState([]);
    const [auditoria, setAuditoria] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [searchText, setSearchText] = useState(''); // Nuevo estado para el texto de búsqueda
    const navigate = useNavigate();

    useEffect(() => {
        SesionUsername();
    }, []);

    useEffect(() => {
        ListarAuditoria();
    }, []);

    useEffect(() => {
        obtenerNombresDeUsuario();
    }, [auditoria]);

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

    const ListarAuditoria = () => {
        AuditService.getAllAudits()
            .then((response) => {
                setAuditoria(response.data);
                obtenerNombresDeUsuario();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const obtenerNombresDeUsuario = async () => {
        try {
            const auditPromises = auditoria.map(async (audit) => {
                try {
                    const userResponse = await UserService.getUserById(audit.cp_id_user);
                    const user = userResponse.data;
                    return { id: audit.cp_id_user, username: user.username };
                } catch (error) {
                    console.error(`Error obteniendo el usuario con ID ${audit.cp_id_user}: ${error}`);
                    return { id: audit.cp_id_user, username: 'N/A' };
                }
            });

            const auditUsers = await Promise.all(auditPromises);

            const usernamesObject = {};
            auditUsers.forEach((user) => {
                usernamesObject[user.id] = user.username;
            });

            setUsernames(usernamesObject);
        } catch (error) {
            console.error(`Error obteniendo nombres de usuario: ${error}`);
        }
    };

    // Función para filtrar auditorías según el texto de búsqueda
    const filterAuditoria = () => {
        return auditoria.filter((audit) => {
            const auditText = `${audit.cp_Audit_id} ${audit.cp_audit_description} ${audit.cp_audit_date} ${usernames[audit.cp_id_user]}`;
            return auditText.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'

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
                        <td><th>{usuarioSesion}</th><tr><td>{usuarioCorreo}</td></tr><tr><td>{usuariotelefono}</td></tr></td>
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
                    <th style={audit}>AUDITORIA </th>
                    <div className="SearchAuditoria">
                        <Form inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar"
                                        className=" mr-sm-2"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
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
                            {filterAuditoria()
                                .toSorted((a, b) => a.cp_Audit_id - b.cp_Audit_id) // Ordena el arreglo por cp_user_id en orden ascendente
                                .map((audit) => (
                                    <tr style={bannerStyle} key={audit.cp_Audit_id}>
                                        <td style={bannerStyle}>{audit.cp_Audit_id}</td>
                                        <td style={bannerStyle}>{audit.cp_audit_description}</td>
                                        <td style={bannerStyle}>{audit.cp_audit_date}</td>
                                        <td style={bannerStyle}>{usernames[audit.cp_id_user] ? (<span>{usernames[audit.cp_id_user]}</span>) : (<span>Cargando...</span>)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <Image className='Img_gest_usua' src={imagenes.Creamos} />
            </div>
        </>
    );

};

export default DataTable;
