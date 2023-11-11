import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Promesas.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Dropdown, Button, Form, Modal, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import UserService from '../../services/UserService';
import { FaRegEdit } from "react-icons/fa";
import PromesasServices from '../../services/PromesasServices';
import AuditService from '../../services/AuditService';

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
            UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
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

    const [listPromesas, setListPromesas] = useState([]);
    useEffect(() => {
        ListPromesas()
    }, [])

    const ListPromesas = () => {
        PromesasServices.getAllpromises().then(response => {
            setListPromesas(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const [cp_type_promise, setcp_type_promise] = useState('');
    const [cp_description_promise, setcp_description_promise] = useState('');
    const [cp_id_promises, setcp_id_promises] = useState('');
    const [editpromisesId, setEditpromisesId] = useState(null); // Add a state variable for editing
    const { Promisesid } = useParams();

    //consulta por ID
    const ConsultarpromisePorId = (Promisesid) => {
        PromesasServices.getpromisesById(Promisesid).then((response) => {
            setcp_id_promises(response.data.cp_id_promises);
            setcp_type_promise(response.data.cp_type_promise);
            setcp_description_promise(response.data.cp_description_promise);

        }).catch(error => {
            console.log(error)
        })
    }

    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            alert("Por favor, complete el formulario correctamente.");
        } else {
            saveOrUpdatepromise();
        }

        setValidated(true);
    }

    const saveOrUpdatepromise = (e) => {

        if (editpromisesId) {
            // Update an existing record
            const promise_edit = { cp_type_promise, cp_description_promise };
            PromesasServices.updatepromises(editpromisesId, promise_edit).then((response) => {
                console.log(response.data);
                const read = Cookies.get()
                UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                    console.log(responseid.data)
                    const cp_id_user = responseid.data.cp_user_id;
                    const cp_audit_description = "Actualizacion de promesa " + cp_type_promise + " " + cp_description_promise;
                    const Audit = { cp_id_user, cp_audit_description };
                    AuditService.CrearAudit(Audit).then((response) => {
                        console.log(response.data);
                        navigate('/Promesas');
                        alert("Promesa de servicio actualizada Exitosamente");
                        window.location.reload();
                    }).catch(error => {
                        console.log(error)
                        alert("Error al crear promesa de servicio")
                    })
                }).catch(error => {
                    console.log(error)
                    alert("Error obtener usuario de sesion")
                })
            }).catch((error) => {
                console.log(error);
                alert("Error al actualizar promesa de servicio")
            });
        } else {
            alert("Error no obtuvo id de promesa")
        }

    };


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
        marginTop: '-25px',
        left: '75%',
        transform: 'translate (-50%, -50%)',
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEditClick = (Promisesid) => {
        handleShow(); // Show the edit modal
        setcp_id_promises(Promisesid);
        setEditpromisesId(Promisesid); // Set the typeOrderId for editing
        ConsultarpromisePorId(Promisesid); // Fetch data for editing
    };

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '60px',
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



    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />

                <div className='Datos_Aud' style={promesas}>
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
                            {listPromesas
                                .map((listPromesas) => (
                                    <tr className='borderless_pro' style={bannerStyle} key={listPromesas.cp_id_promises}>
                                        <td style={bannerStyle}>{listPromesas.cp_id_promises}</td>

                                        <td style={bannerStyle}>{listPromesas.cp_type_promise}</td>
                                        <td style={bannerStyle}>{listPromesas.cp_description_promise}</td>
                                        <td style={bannerStyle2}>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <Button onClick={() => handleEditClick(listPromesas.cp_id_promises)} className='Edit_pro'>
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
                                    value={cp_id_promises}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                                <Form.Label>Tipo de Promesa</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo de Promesa"
                                    autoFocus
                                    value={cp_type_promise}
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
                                    value={cp_description_promise}
                                    onChange={(e) => setcp_description_promise(e.target.value)}
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