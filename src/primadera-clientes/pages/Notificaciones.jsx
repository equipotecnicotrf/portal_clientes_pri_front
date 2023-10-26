import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Notificaciones.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Dropdown, Button, Form, Modal, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import UserService from '../../services/UserService';
import { FaRegEdit } from "react-icons/fa";
import NotificationService from '../../services/NotificationService';
import AuditService from '../../services/AuditService';

const DataTable = ({ backgroundColor }) => {
    const [selectedOption, setSelectedOption] = useState('Acciones');

    //validacion de sesion activa
    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuariotelefono, setUsuarioTelefono] = useState([]);
    const [usuarioid, setUsuarioid] = useState([]);
    const [cpnotificationId, setcpnotificationId] = useState([]);
    const [cpnotificationcontext, setcpnotificationcontext] = useState([]);
    const [cpnotificationName, setcpnotificationName] = useState([]);
    const [cpnotificationMessage, setcpnotificationMessage] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
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
                setUsuarioTelefono(responseid.data.cp_cell_phone);
                setUsuarioid(responseid.data.cp_user_id);

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

    const [Notificacion, setNotificacion] = useState([]);
    useEffect(() => {
        ListNotificaciones()
    }, [])

    const ListNotificaciones = () => {
        NotificationService.getAllNotifications().then(response => {
            setNotificacion(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }


    const handleEditClick = (id_noti, NotiContext, NotiName, NotiMessage) => {
        handleShow(); // Show the edit modal
        setcpnotificationId(id_noti);
        setcpnotificationcontext(NotiContext);
        setcpnotificationName(NotiName);
        setcpnotificationMessage(NotiMessage);
    };

    const backgroundStyle = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
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

    {/*AJUSTES 19-10-2023 INI*/ }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            alert("Por favor, complete el formulario correctamente.");
        } else {
            updateNoti();
        }

        setValidated(true);
    }

    const updateNoti = (e) => {
        if (cpnotificationId) {
            const cp_Notification_name = cpnotificationName;
            const cp_Notification_message = cpnotificationMessage;
            const UserEdit = { cp_Notification_name, cp_Notification_message };
            NotificationService.updateNoti(cpnotificationId, UserEdit)
                .then((response) => {
                    console.log(response.data);
                    const cp_id_user = usuarioid;
                    const cp_audit_description = "Actualizacion Notificacion " + cp_Notification_name;
                    const Audit = { cp_id_user, cp_audit_description };
                    AuditService.CrearAudit(Audit).then((response) => {
                        console.log(response.data);
                        navigate('/Notificaciones');
                        alert("La Notificacion se han actualizado correctamente");
                        window.location.reload();
                    }).catch(error => {
                        console.log(error)
                        alert("Error al crear auditoria")
                    })
                })
                .catch((error) => {
                    console.log(error);
                    alert("Error al actualizar Notificacion, Por favor diligenciar todos los campos");
                });
        }
    };

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px',
    };

    const bannerStyle2 = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '13px',
        textAlign: 'center',

    };

    const notificacion = {
        padding: '20px',
    };

    {/*AJUSTES 19-10-2023 FIN*/ }

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
                        <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoría</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Consecutivos'); navigate("/GestionarConsecutivos"); }}>Gestionar Consecutivos</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Iva'); navigate("/DataIva"); }}>Gestionar Iva</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>





                {/*AJUSTES 19-10-2023 INI*/}
                <div className='DataTable_noti' style={bannerStyle}>
                    <th style={notificacion}>GESTIONAR TIPO DE NOTIFICACIONES</th>
                    <table className='table table-bordered' >
                        <thead style={bannerStyle}>
                            <tr className='borderless_noti' style={bannerStyle} >
                                <th className='borderless_noti' style={bannerStyle}>Código</th>
                                <th style={bannerStyle}>Tipo de Notificación</th>
                                <th style={bannerStyle}>Asunto</th>
                                <th className='borderless_noti' style={bannerStyle}>Acciones</th>
                            </tr>

                        </thead>
                        <tbody style={bannerStyle}>
                            {Notificacion
                                .map((Notificacion) => (
                                    <tr className='borderless_noti' key={Notificacion.cp_Notification_id} onClick={() => setSelectedNotification(notificacion)}>
                                        <td style={bannerStyle}>{Notificacion.cp_Notification_id}</td>
                                        <td style={bannerStyle}>{Notificacion.cp_Notification_context}</td>
                                        <td style={bannerStyle}>{Notificacion.cp_Notification_name}</td>
                                        <td style={bannerStyle2}>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <Button onClick={() => handleEditClick(Notificacion.cp_Notification_id, Notificacion.cp_Notification_context, Notificacion.cp_Notification_name, Notificacion.cp_Notification_message)} className='Edit_noti'>
                                                <FaRegEdit />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>




                <Modal show={show} onHide={handleClose}>
                    <Modal.Header className='Edit_noti' closeButton>
                        <Modal.Title><FaRegEdit className='btn_faregedit_noti' /> MODIFICAR DATOS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Edit_noti' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit}  >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Código</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Código"
                                    autoFocus
                                    disabled
                                    value={cpnotificationId}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                                <Form.Label>Tipo de Notificación</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo de Notificación"
                                    autoFocus
                                    disabled
                                    value={cpnotificationcontext}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Asunto</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Asunto"
                                    autoFocus
                                    required
                                    value={cpnotificationName}
                                    onChange={(e) => setcpnotificationName(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el asunto</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Cuerpo del Correo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={6}
                                    placeholder="Cuerpo del correo"
                                    autoFocus
                                    required
                                    value={cpnotificationMessage}
                                    onChange={(e) => setcpnotificationMessage(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el cuerpo del correo</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>

                            <Modal.Footer className='Edit_noti' >
                                <Button className='Guardar-btn-noti' type='submit'>Guardar</Button>
                            </Modal.Footer>

                        </Form>
                    </Modal.Body>
                </Modal>

                {/*AJUSTES 19-10-2023 FIN*/}

                <Image className='Img-Creamos_ped' src={imagenes.Creamos} />
            </div > {/*AJUSTE LCPG*/}
        </>
    );
};

export default DataTable;