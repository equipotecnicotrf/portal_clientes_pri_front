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

    // consulta de auditoria
    const [auditoria, SetAuditoria] = useState([]);

    //para traer los nombres de los usuarios
    const [usernames, setUsernames] = useState({});

    //listar los datos de auditoria
    const ListarAuditoria = () => {
        AuditService.getAllAudits().then(response => {
            SetAuditoria(response.data)
            console.log(response.data)

            //traer datos de nombre de usuarios de la tabla users
            obtenerNombresDeUsuario();
        }).catch(error => {
            console.log(error);
        })
    }

    //consulta username para tabla auditoria
    const obtenerNombresDeUsuario = async () => {
        try {
            const auditPromises = auditoria.map(async (audit) => {
                try {
                    const userResponse = await UserService.getUserById(audit.cp_id_user);
                    const user = userResponse.data;
                    return { id: audit.cp_id_user, username: user.username };
                } catch (error) {
                    console.error(`Error obteniendo el usuario con ID ${audit.cp_id_user}: ${error}`);
                    return { id: audit.cp_id_user, username: "N/A" }; // Puedes proporcionar un valor predeterminado si la obtención falla
                }
            });

            const auditUsers = await Promise.all(auditPromises);

            // Convertir el arreglo de auditorías a un objeto de usernames para un acceso más eficiente
            const usernamesObject = {};
            auditUsers.forEach((user) => {
                usernamesObject[user.id] = user.username;
            });

            setUsernames(usernamesObject);
        } catch (error) {
            console.error(`Error obteniendo nombres de usuario: ${error}`);
        }
    };


    useEffect(() => {
        ListarAuditoria()
    }, [])

    useEffect(() => {
        obtenerNombresDeUsuario()
    }, [auditoria])

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
                            {auditoria
                                .sort((a, b) => a.cp_Audit_id - b.cp_Audit_id) // Ordena el arreglo por cp_Audit_id en orden ascendente
                                .map((auditoria) => (
                                    <tr style={bannerStyle} key={auditoria.cp_Audit_id}>
                                        <td style={bannerStyle}>{auditoria.cp_Audit_id}</td>
                                        <td style={bannerStyle}>{auditoria.cp_audit_description}</td>
                                        <td style={bannerStyle}>{auditoria.cp_audit_date}</td>
                                        <td style={bannerStyle}>{usernames[auditoria.cp_id_user] ? (<span>{usernames[auditoria.cp_id_user]}</span>) : (<span>Cargando...</span>)}</td>
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
