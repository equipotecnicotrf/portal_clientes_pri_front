import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/GestionarConsecutivos.css';
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
import ConsecutiveService from '../../services/ConsecutiveService';
import AuditService from '../../services/AuditService';

const GestionarConsecutivos = ({ backgroundColor }) => {
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


    //listar consecutivos
    const [consecutivo, Setconsecutivo] = useState([]);
    useEffect(() => {
        ListarConsecutivo()
    }, [])

    const ListarConsecutivo = () => {
        ConsecutiveService.getAllConsecutives().then(response => {
            Setconsecutivo(response.data)
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        })
    }

    const [cp_Consecutive_code, setcp_Consecutive_code] = useState('');
    const [cp_Consecutive_num, setcp_Consecutive_num] = useState('');
    const [cp_Consecutive_date_start, setcp_Consecutive_date_start] = useState('');
    const [cp_Consecutive_date_end, setcp_Consecutive_date_end] = useState('');
    const [cp_Consecutive_id, setcp_Consecutive_id] = useState('');
    const [editConsecutiveId, seteditConsecutiveId] = useState(null); // Add a state variable for editing
    const { ConsecutiveId } = useParams();

    //consulta por ID
    const ConsultarconsecutivoPorId = (ConsecutiveId) => {
        ConsecutiveService.getConsecutiveById(ConsecutiveId).then((response) => {
            setcp_Consecutive_code(response.data.cp_Consecutive_code);
            setcp_Consecutive_num(response.data.cp_Consecutive_num);
            setcp_Consecutive_date_start(response.data.cp_Consecutive_date_start);
            setcp_Consecutive_date_end(response.data.cp_Consecutive_date_end);

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
            saveOrUpdateConsecutive();
        }

        setValidated(true);
    }

    const saveOrUpdateConsecutive = (e) => {

        if (editConsecutiveId) {
            // Update an existing record
            const consecutive_edit = { cp_Consecutive_code, cp_Consecutive_num, cp_Consecutive_date_start, cp_Consecutive_date_end };
            ConsecutiveService.updateConsecutive(editConsecutiveId, consecutive_edit).then((response) => {
                console.log(response.data);
                const read = Cookies.get()
                UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                    console.log(responseid.data)
                    const cp_id_user = responseid.data.cp_user_id;
                    const cp_audit_description = "Actualizacion de consecutivo " + cp_Consecutive_code + " " + cp_Consecutive_num + " " + cp_Consecutive_date_start + " " + cp_Consecutive_date_end;
                    const Audit = { cp_id_user, cp_audit_description };
                    AuditService.CrearAudit(Audit).then((response) => {
                        console.log(response.data);
                        navigate('/GestionarConsecutivos');
                        alert("Consecutivo actualizado Exitosamente");
                        window.location.reload();
                    }).catch(error => {
                        console.log(error)
                        alert("Error al crear auditoria")
                    })
                }).catch(error => {
                    console.log(error)
                    alert("Error obtener usuario de sesion")
                })
            }).catch((error) => {
                console.log(error);
                alert("Error al actualizar Consecutivo")
            });
        } else {
            // Create a new record
            const existingType = consecutivo.find(item => item.cp_Consecutive_code === cp_Consecutive_code || item.cp_Consecutive_num === cp_Consecutive_num);

            if (existingType) {
                alert("Ya existe un consecutivo con el mismo codigo.");
            } else {
                const consecutivecreate = { cp_Consecutive_code, cp_Consecutive_num, cp_Consecutive_date_start, cp_Consecutive_date_end };
                ConsecutiveService.createConsecutive(consecutivecreate).then((response) => {
                    console.log(response.data);
                    const read = Cookies.get()
                    UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                        console.log(responseid.data)
                        const cp_id_user = responseid.data.cp_user_id;
                        const cp_audit_description = "Creacion de consecutivo " + cp_Consecutive_code + " " + cp_Consecutive_num + " " + cp_Consecutive_date_start + " " + cp_Consecutive_date_end;
                        const Audit = { cp_id_user, cp_audit_description };
                        AuditService.CrearAudit(Audit).then((response) => {
                            console.log(response.data);
                            navigate('/GestionarConsecutivos');
                            alert("Consecutivo creado Exitosamente");
                            window.location.reload();
                        }).catch(error => {
                            console.log(error)
                            alert("Error al crear auditoria")
                        })
                    }).catch(error => {
                        console.log(error)
                        alert("Error obtener usuario de sesion")
                    })
                })
                    .catch((error) => {
                        console.log(error);
                        alert("Error al crear Consecutivo, Por favor diligenciar todos los campos")
                    });
            }
        }
    };

    const backgroundStyle = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
    };

    const consecutivos = {
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

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const handleEditClick = (ConsecutiveId) => {
        handleShow(); // Show the edit modal
        setcp_Consecutive_id(ConsecutiveId);
        seteditConsecutiveId(ConsecutiveId); // Set the typeOrderId for editing
        ConsultarconsecutivoPorId(ConsecutiveId); // Fetch data for editing
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

    const consecutivos_2 = {
        padding: '20px',
    };




    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />

                <div style={consecutivos}>
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
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Promesas'); navigate("/Promesas"); }}>Gestionar Promesas</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>


                <div className='DataTable_cons' style={bannerStyle}>
                    <th style={consecutivos_2}>GESTIONAR CONSECUTIVOS</th>
                    <table className='table table-bordered' >
                        <thead style={bannerStyle}>
                            <tr className='borderless_cons' style={bannerStyle} >
                                <th className='borderless_cons' style={bannerStyle}>ID</th>
                                <th style={bannerStyle}>Código Consecutivo</th>
                                <th style={bannerStyle}>Número Consecutivo</th>
                                <th style={bannerStyle}>Fecha Inicio</th>
                                <th style={bannerStyle}>Fecha Fin</th>
                            </tr>

                        </thead>
                        <tbody style={bannerStyle}>

                            {consecutivo
                                .map((consecutivo) => (
                                    <tr className='borderless_cons' style={bannerStyle} key={consecutivo.cp_Consecutive_id}>
                                        <td style={bannerStyle}>{consecutivo.cp_Consecutive_id}</td>
                                        <td style={bannerStyle}>{consecutivo.cp_Consecutive_code}</td>
                                        <td style={bannerStyle}>{consecutivo.cp_Consecutive_num}</td>
                                        <td style={bannerStyle}>{consecutivo.cp_Consecutive_date_start}</td>
                                        <td style={bannerStyle}>{consecutivo.cp_Consecutive_date_end}</td>
                                        <td style={bannerStyle2}>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <Button onClick={() => handleEditClick(consecutivo.cp_Consecutive_id)} className='Edit_cons'>
                                                <FaRegEdit />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>






                <Modal show={show} onHide={handleClose}>
                    <Modal.Header className='Edit_cons' closeButton>
                        <Modal.Title><FaRegEdit className='btn_faEdit_cons' /> MODIFICAR DATOS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Edit_cons' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Código Consecutivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Código Consecutivo"
                                    autoFocus
                                    required
                                    value={cp_Consecutive_code}
                                    disabled
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el código del consecutivo</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                                <Form.Label>Número Consecutivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Número Consecutivo"
                                    autoFocus
                                    required
                                    value={cp_Consecutive_num}
                                    disabled
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el número del consecutivo</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}

                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha inicio"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_Consecutive_date_start}
                                    onChange={(e) => setcp_Consecutive_date_start(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de inicio</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha inicio"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_Consecutive_date_end}
                                    onChange={(e) => setcp_Consecutive_date_end(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha fin</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>

                            <Modal.Footer className='Edit_cons' >
                                <Button className='Guardar-btn-cons' type='submit'>Guardar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                <div className="botones_cons mt-12">
                    <Button className="boton_cons p-2 m-2 btn-sm" onClick={handleShow2}>Crear</Button> {/*AJUSTE LCPG*/}
                </div>






                <Modal show={show2} onHide={handleClose2}>
                    <Modal.Header className='Edit_cons' closeButton>
                        <Modal.Title>CREAR CONSECUTIVOS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Edit_cons' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Código Consecutivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Código Consecutivo"
                                    autoFocus
                                    required
                                    value={cp_Consecutive_code}
                                    onChange={(e) => setcp_Consecutive_code(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el código del consecutivo</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                                <Form.Label>Número Consecutivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Número Consecutivo"
                                    autoFocus
                                    required
                                    value={cp_Consecutive_num}
                                    onChange={(e) => setcp_Consecutive_num(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el número del consecutivo</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha inicio"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_Consecutive_date_start}
                                    onChange={(e) => setcp_Consecutive_date_start(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de inicio</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha inicio"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_Consecutive_date_end}
                                    onChange={(e) => setcp_Consecutive_date_end(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha fin</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Modal.Footer className='Edit_cons' >
                                <Button className='Guardar-btn-cons' type='submit'>Guardar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Image className='Img-Creamos_cons' src={imagenes.Creamos} />
            </div >
        </>
    );
};

export default GestionarConsecutivos;