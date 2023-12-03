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
import { BsFillEyeFill } from "react-icons/bs"; {/*20-10-2023*/ }
import AccessService from '../../services/AccessService';



const DataTable = ({ backgroundColor }) => {
    const [selectedOption, setSelectedOption] = useState('Auditoría');
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

    const SesionUsername = () => {
        if (LoginService.isAuthenticated()) {
            const read = Cookies.get();
            UserService.getUserByUsername(read.portal_sesion)
                .then((responseid) => {
                    setUsuarioSesion(responseid.data.cp_name);
                    setUsuarioCorreo(responseid.data.username);
                    setUsuarioTelefono(responseid.data.cp_cell_phone);

                    ListSeguridad(responseid.data.cp_rol_id);
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
        AuditService.getAllAuditsAndUser()
            .then((response) => {
                setAuditoria(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    // Función para filtrar auditorías según el texto de búsqueda
    const filterAuditoria = () => {
        return auditoria.filter((audit) => {
            const auditText = `${audit[0].cp_Audit_id} ${audit[0].cp_audit_description} ${audit[0].cp_audit_date} ${usernames[audit[0].cp_id_user]}`;
            return auditText.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    // consulta de contextos
    const [seguridad, setSeguridad] = useState([]);
    const ListSeguridad = (cp_rol_id) => {
        AccessService.getAllAccessAndContext(cp_rol_id).then(responsecontext => {
            setSeguridad(responsecontext.data);
            console.log(responsecontext.data);
        }).catch(error => {
            console.log(error);
        })
    };

    const hasAccess = (cp_context_id) => {
        const seguridadItem = seguridad.find((item) => item[0].cp_context_id === cp_context_id);
        return seguridadItem && seguridadItem[0].cp_access_assign === 1;
    };

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',

        maxHeight: '500px',/*30-10-2023*/
        overflow: 'auto', /*30-10-2023*/

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
    const bannerStyle2 = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        textAlign: 'center',
        marginTop: '50px', /*30-10-2023*/

    };

    const dropDownbackgroundStyle = {
        backgroundColor: 'white',
        color: 'Black',
        borderRadius: '10px',
        borderColor: 'Black',
        width: '250px'
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
                {/*31-10-2023 se ajusta DIV completo*/}
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
                {/*31-10-2023 se ajusta DIV completo*/}
                <Dropdown className='boton-auditoria'>
                    <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
                        {selectedOption}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={dropDownbackgroundStyle}>
                        {hasAccess(1) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoría</Dropdown.Item>
                        )}
                        {hasAccess(2) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Consecutivos'); navigate("/GestionarConsecutivos"); }}>Gestionar Consecutivos</Dropdown.Item>
                        )}
                        {hasAccess(3) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Iva'); navigate("/DataIva"); }}>Gestionar Iva</Dropdown.Item>
                        )}
                        {hasAccess(4) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Promesas'); navigate("/Promesas"); }}>Gestionar Promesas</Dropdown.Item>
                        )}
                        {hasAccess(5) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
                        )}
                        {hasAccess(6) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
                        )}
                        {hasAccess(7) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
                        )}
                        {hasAccess(8) && (
                            <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>


                <div className='DataTableAudi' style={bannerStyle}>
                    <th style={audit}><BsFillEyeFill /> AUDITORIA </th>
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
                    <table className='table table-bordered' style={bannerStyle2} >

                        <thead style={bannerStyle}>
                            <tr style={bannerStyle} className='borderless_audit'>
                                <th style={bannerStyle} className='borderless_audit' >ID</th>
                                <th style={bannerStyle}>Descripción</th>
                                <th style={bannerStyle}>Fecha/Hora</th>
                                <th style={bannerStyle} className='borderless_audit' >Editado por</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {filterAuditoria()
                                .toSorted((a, b) => a[0].cp_Audit_id - b[0].cp_Audit_id) // Ordena el arreglo por cp_user_id en orden ascendente
                                .map((audit) => (
                                    <tr style={bannerStyle} className='borderless_audit' key={audit[0].cp_Audit_id}>
                                        <td style={bannerStyle}>{audit[0].cp_Audit_id}</td>
                                        <td style={bannerStyle}>{audit[0].cp_audit_description}</td>
                                        <td style={bannerStyle}>{audit[0].cp_audit_date}</td>
                                        <td style={bannerStyle}>{audit[1].username}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <Image className='Img_audit' src={imagenes.Creamos} />
            </div>
        </>
    );

};

export default DataTable;