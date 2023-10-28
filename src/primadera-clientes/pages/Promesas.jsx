import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Promesas.css';
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

const Promesas = ({ backgroundColor }) => {
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
    const promesas = {
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
        top: '30%',
        left: '76.4%',
        transform: 'translate (-50%, -50%)',
    };

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
        maxHeight: '500px',
        overflow: 'auto',
    };

    const bannerStyle2 = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '13px',
        textAlign: 'center',

    };

    const bannerStyle3 = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        textAlign: 'center',
        marginTop: '16px',
    };


    const promesas2 = {
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
            }, {
                codigo: '02', tipo: 'Nuevo usuario', asunto: 'Se ha creado usuario', cuerpo_not: '1234556'
            }, {
                codigo: '03', tipo: 'Envio pedido', asunto: 'Se ha creado pedido', cuerpo_not: '1234556'
            }, {
                codigo: '02', tipo: 'Nuevo usuario', asunto: 'Se ha creado usuario', cuerpo_not: '1234556'
            }, {
                codigo: '03', tipo: 'Envio pedido', asunto: 'Se ha creado pedido', cuerpo_not: '1234556'
            }
        ]


    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />

                <div style={promesas}>
                    <tr>
                        <div className='ubica_imagen_pro'>
                            <td><Container>
                                <Row>
                                    <Col xs={6} md={4}>
                                        <Image className='Img-Admin-Pro' src={imagenes.Arboles} roundedCircle />
                                    </Col>
                                </Row>
                            </Container>
                            </td>
                        </div>

                        <div className='ubica_datos_pro'>
                            <td>
                                <th>{usuarioSesion}</th>
                                <tr><td>{usuarioCorreo}</td></tr>
                                <tr><td>{usuariotelefono}</td></tr>
                            </td>
                        </div>
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
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Promesas'); navigate("/Promesas"); }}>Gestionar Promesas</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <div className='DataTable_pro' style={bannerStyle}>
                    <th style={promesas2}>GESTIONAR PROMESAS DE SERVICIO</th>
                    <table className='table table-bordered' style={bannerStyle3} >
                        <thead style={bannerStyle} >
                            <tr className='borderless_pro' style={bannerStyle} >
                                <th className='borderless_pro' style={bannerStyle}>Código</th>
                                <th style={bannerStyle}>Tipo de Promesa</th>
                                <th style={bannerStyle}>Descripción</th>
                                <th className='borderless_pro' style={bannerStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {notificaciones
                                .map((notificaciones) => (
                                    <tr className='borderless_pro' style={bannerStyle} key={notificaciones.codigo}>
                                        <td style={bannerStyle}>{notificaciones.codigo}</td>

                                        <td style={bannerStyle}>{notificaciones.tipo}</td>
                                        <td style={bannerStyle}>{notificaciones.asunto}</td>
                                        <td style={bannerStyle2}>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <Button onClick={handleShow} className='Edit_pro'>
                                                <FaRegEdit />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header className='Edit_pro' closeButton>
                        <Modal.Title><FaRegEdit className='btn_faregedit_pro' /> MODIFICAR DATOS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Edit_pro' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
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
                                <Form.Label>Tipo de Promesa</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo de Promesa"
                                    autoFocus
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripción"
                                    autoFocus
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la descripción</Form.Control.Feedback>
                            </Form.Group>
                            <Modal.Footer className='Edit_pro' >
                                <Button className='Guardar-btn-pro' type='submit'>Guardar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Image className='Img-Creamos_ped' src={imagenes.Creamos} />
            </div >
        </>
    );
};

export default Promesas;