import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/GestionarIva.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import AuditService from '../../services/AuditService';
import UserService from '../../services/UserService';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";
import IvaService from '../../services/IvaService'


const DataIva = ({ backgroundColor }) => {

    const [selectedOption, setSelectedOption] = useState('Acciones');

    //validacion de sesion activa
    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuariotelefono, setUsuarioTelefono] = useState([]);
    const [usuarioid, setUsuarioid] = useState([]);
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

    //listar iva
    const [porcIva, SetPorcIva] = useState([]);
    useEffect(() => {
        ListarIva()
    }, [])

    const ListarIva = () => {
        IvaService.getAllIva().then(response => {
            SetPorcIva(response.data)
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        })
    }

    const [cpIvaId, setcpIvaId] = useState('');
    const [cp_IVA, setcpIva] = useState('');
    const [cp_IVA_date_start, setcpDateStart] = useState('');
    const [cp_IVA_date_end, setcpDateEnd] = useState('');
    const [editIvaId, setEditIvaId] = useState(null); // Add a state variable for editing



    //consulta por ID
    const ConsultarIvaPorId = (IvaId) => {
        IvaService.getIVAById(IvaId).then((response) => {
            setcpIva(response.data.cp_IVA);
            setcpDateStart(response.data.cp_IVA_date_start);
            setcpDateEnd(response.data.cp_IVA_date_end);
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
            saveOrUpdateIva();
        }

        setValidated(true);
    }

    const saveOrUpdateIva = (e) => {
        if (editIvaId) {
            // Update an existing record            
            const Iva_edit = { cp_IVA, cp_IVA_date_start, cp_IVA_date_end };
            IvaService.updateIva(editIvaId, Iva_edit).then((response) => {
                console.log(response.data);
                const read = Cookies.get()
                UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                    console.log(responseid.data)
                    const cp_id_user = responseid.data.cp_user_id;
                    const cp_audit_description = "Actualizacion de IVA " + cp_IVA + " " + cp_IVA_date_start + " " + cp_IVA_date_end;
                    const Audit = { cp_id_user, cp_audit_description };
                    AuditService.CrearAudit(Audit).then((response) => {
                        console.log(response.data);
                        navigate('/DataIva');
                        alert("IVA actualizado Exitosamente");
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
                alert("Error al actualizar IVA")
            });
        } else {
            // Create a new record
            const existingType = porcIva.find(ivalist => ivalist.cp_IVA === cp_IVA);

            if (existingType) {
                alert("Ya existe un IVA con el mismo porcentaje.");
            } else {
                const Iva = { cp_IVA, cp_IVA_date_start, cp_IVA_date_end };
                IvaService.createIva(Iva).then((response) => {
                    console.log(response.data);
                    const read = Cookies.get()
                    UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                        console.log(responseid.data)
                        const cp_id_user = responseid.data.cp_user_id;
                        const cp_audit_description = "Creacion de IVA " + cp_IVA + " " + cp_IVA_date_start + " " + cp_IVA_date_end;
                        const Audit = { cp_id_user, cp_audit_description };
                        AuditService.CrearAudit(Audit).then((response) => {
                            console.log(response.data);
                            navigate('/DataIva');
                            alert("IVA creado Exitosamente");
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
                        alert("Error al crear IVA, Por favor diligenciar todos los campos")
                    });
            }
        }
    };


    const handleEditClick = (cpIvaId) => {
        handleEditShow(); // Show the edit modal
        setcpIvaId(cpIvaId);
        setEditIvaId(cpIvaId); // Set the cpIVA for editing
        ConsultarIvaPorId(cpIvaId); // Fetch data for editing
    };

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '30px',
    };

    const bannerStyle2 = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '15px',
        textAlign: 'center',
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

    const iva = {
        padding: '20px',
    };

    const iva2 = {
        padding: '60px',
        height: '23vh',
        marginTop: '-35px'
    };

    const [editShow, editSetShow] = useState(false);

    const handleEditClose = () => editSetShow(false);
    const handleEditShow = () => editSetShow(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />
                <div style={iva2}>
                    <tr>
                        <td >
                            <Container >
                                <Row>
                                    <Col xs={2} md={2} >
                                        <Image className='imagen-circular' src={imagenes.Arboles} roundedCircle />
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

                <div className='DataTableIva' style={bannerStyle}>
                    <th style={iva}>GESTIONAR IVA</th>
                    <table className='table table-bordered' >
                        <thead style={bannerStyle}>
                            <tr className='bordered_iva' style={bannerStyle} >
                                <th className='bordered_iva' style={bannerStyle}>% de IVA</th>
                                <th style={bannerStyle}>Fecha Inicio</th>
                                <th style={bannerStyle}>Fecha Finalización</th>
                                <th className='bordered_iva' style={bannerStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {porcIva
                                .toSorted((a, b) => a.cp_IVA_id - b.cp_IVA_id) // Ordena el arreglo por cp_type_order_id en orden ascendente
                                .map((porcIva) => (
                                    <tr className='bordered_iva' style={bannerStyle} key={porcIva.cp_IVA_id}>
                                        <td style={bannerStyle}>{porcIva.cp_IVA}</td>
                                        <td style={bannerStyle}>{porcIva.cp_IVA_date_start}</td>
                                        <td style={bannerStyle}>{porcIva.cp_IVA_date_end}</td>
                                        <td style={bannerStyle2}>
                                            {/* Call handleEditClick with porcIva.cp_IVA_date_end */}
                                            <button onClick={() => handleEditClick(porcIva.cp_IVA_id)} className='Edit-Iva '>
                                                <FaRegEdit />
                                            </button>

                                        </td>
                                        {/*AJUSTE LCPG FIN*/}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="botones-Iva mt-12">
                    <Button className="Crear-btn-iva p-1 m-1 btn-sm" onClick={handleShow}>Crear</Button>
                </div>

                <Modal show={editShow} onHide={handleEditClose}>
                    <Modal.Header className='Edit-iva' closeButton>
                        <Modal.Title>EDITAR IVA</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Edit-iva' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" >
                                <Form.Label>% IVA</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="IVA"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_IVA}
                                    disabled
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el valor del IVA</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" >
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha inicio"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_IVA_date_start}
                                    onChange={(e) => setcpDateStart(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de inicio IVA</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Finalización</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha finalización"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_IVA_date_end}
                                    onChange={(e) => setcpDateEnd(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de finalización IVA</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Modal.Footer className='Edit-iva' >
                                <Button className='Guardar-btn-iva' type='submit'>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>




                <Modal show={show} onHide={handleClose}>
                    <Modal.Header className='Crear-iva' closeButton>
                        <Modal.Title>CREAR</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Crear-iva' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" >
                                <Form.Label>% IVA</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="IVA"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_IVA}
                                    onChange={(e) => setcpIva(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el valor del IVA</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha inicio"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_IVA_date_start}
                                    onChange={(e) => setcpDateStart(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de inicio IVA</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Finalización</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha finalización"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_IVA_date_end}
                                    onChange={(e) => setcpDateEnd(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de finalización IVA</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Modal.Footer className='Crear-iva' >
                                <Button className='Guardar-btn-iva' type='submit' >
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Image className='Img-Creamos_iva' src={imagenes.Creamos} />
            </div>
        </>
    );
};

export default DataIva;