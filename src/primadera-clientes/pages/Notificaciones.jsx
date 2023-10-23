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

const DataTable = ({ backgroundColor }) => {
    const [selectedOption, setSelectedOption] = useState('Acciones');

    //validacion de sesion activa
    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuariotelefono, setUsuarioTelefono] = useState([]);
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
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px',
    };

    const notificacion = {
        padding: '20px',
    };

    const notificaciones =
        [
            {
                codigo: '01', tipo: 'Cambio contraseña', asunto: 'Se ha cambiado su contraseña', cuerpo_not: '1234556'
            }, {
                codigo: '02', tipo: 'Nuevo usuario', asunto: 'Se ha creado usuario', cuerpo_not: '1234556'
            }, {
                codigo: '03', tipo: 'Envio pedido', asunto: 'Se ha creado pedido', cuerpo_not: '1234556'
            }
        ]
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
                            {notificaciones
                                .map((notificaciones) => (
                                    <tr className='borderless_noti' style={bannerStyle} key={notificaciones.codigo}>
                                        <td style={bannerStyle}>{notificaciones.codigo}</td>

                                        <td style={bannerStyle}>{notificaciones.tipo}</td>
                                        <td style={bannerStyle}>{notificaciones.asunto}</td>
                                        <td style={bannerStyle}>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <Button onClick={handleShow} className='Edit_noti'>
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
                        <Modal.Title>MODIFICAR DATOS</Modal.Title>
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
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                                <Form.Label>Tipo de Notificación</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo de Notificación"
                                    autoFocus
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Asunto</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Asunto"
                                    autoFocus
                                    required
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