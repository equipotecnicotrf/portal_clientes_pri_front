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
import TypeOrderService from '../../services/TypeOrderService';
import AuditService from '../../services/AuditService';
import UserService from '../../services/UserService';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";


const DataIva = ({ backgroundColor }) => {

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
            UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
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

    //listar tipo de pedidos
    const [tipoPedido, SetTipoPedido] = useState([]);
    useEffect(() => {
        ListarTipoPedido()
    }, [])

    const ListarTipoPedido = () => {
        TypeOrderService.getAllTypeOrder().then(response => {
            SetTipoPedido(response.data)
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        })
    }

    const [cp_type_order_description, setcp_Type_Order_Description] = useState('');
    const [cp_type_order_meaning, setcp_Type_Order_Meaning] = useState('');
    const [cp_type_order_status, setcp_Type_Order_Status] = useState('');
    const [cp_type_order_id, setcp_Type_Order_Id] = useState('');
    const [editTypeOrderId, setEditTypeOrderId] = useState(null); // Add a state variable for editing
    const { typeOrderId } = useParams();

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    //consulta por ID
    const ConsultarTipoPedidoPorId = (typeOrderId) => {
        TypeOrderService.getTypeOrderById(typeOrderId).then((response) => {
            setcp_Type_Order_Description(response.data.cp_type_order_description);
            setcp_Type_Order_Meaning(response.data.cp_type_order_meaning);
            setcp_Type_Order_Status(response.data.cp_type_order_status);
            // Aquí establece el estado de los checkboxes en función del valor de cp_type_order_status
            if (response.data.cp_type_order_status === "Activo") {
                setCheckbox2(true); // Activo
            } else {
                setCheckbox2(false); // Activo
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const saveOrUpdateTypeOrder = (e) => {
        const typeOrder = {
            cp_type_order_description,
            cp_type_order_meaning,
            cp_type_order_status: "Activo",
        };

        if (editTypeOrderId) {
            // Update an existing record
            TypeOrderService.updateTypEOrder(editTypeOrderId, typeOrder).then((response) => {
                console.log(response.data);
                const read = Cookies.get()
                UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                    console.log(responseid.data)
                    const cp_id_user = responseid.data.cp_user_id;
                    const cp_audit_description = "Actualizacion de tipo pedido " + cp_type_order_meaning + " " + cp_type_order_description;
                    const Audit = { cp_id_user, cp_audit_description };
                    AuditService.CrearAudit(Audit).then((response) => {
                        console.log(response.data);
                        navigate('/Pedidos');
                        alert("Tipo Pedido actualizado Exitosamente");
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
                alert("Error al actualizar Tipo Pedido")
            });
        } else {
            // Create a new record
            TypeOrderService.createTypEOrder(typeOrder).then((response) => {
                console.log(response.data);
                const read = Cookies.get()
                UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                    console.log(responseid.data)
                    const cp_id_user = responseid.data.cp_user_id;
                    const cp_audit_description = "Creacion de tipo pedido " + cp_type_order_meaning + " " + cp_type_order_description;
                    const Audit = { cp_id_user, cp_audit_description };
                    AuditService.CrearAudit(Audit).then((response) => {
                        console.log(response.data);
                        navigate('/Pedidos');
                        alert("Tipo Pedido creado Exitosamente");
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
                    alert("Error al crear Tipo Pedido")
                });
        }
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

    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [checkbox3, setCheckbox3] = useState(false);
    const [editShow, editSetShow] = useState(false);

    const handleCheckbox1Change = () => {
        setCheckbox1();
    };
    const handleCheckbox2Change = () => {
        setCheckbox2();
    };
    const handleCheckbox3Change = () => {
        setCheckbox3();
    };

    const handleEditClose = () => editSetShow(false);
    const handleEditShow = () => editSetShow(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEditClick = (typeOrderId) => {
        handleEditShow(); // Show the edit modal
        setcp_Type_Order_Id(typeOrderId);
        setEditTypeOrderId(typeOrderId); // Set the typeOrderId for editing
        ConsultarTipoPedidoPorId(typeOrderId); // Fetch data for editing
    };

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
                        <td><th>{usuarioSesion}</th><tr><td>{usuarioCorreo}</td></tr></td>
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
                            {tipoPedido
                                .toSorted((a, b) => a.cp_type_order_id - b.cp_type_order_id) // Ordena el arreglo por cp_type_order_id en orden ascendente
                                .map((tipoPedido) => (
                                    <tr className='bordered_iva' style={bannerStyle} key={tipoPedido.cp_type_order_id}>
                                        <td style={bannerStyle}>{tipoPedido.cp_type_order_id}</td>
                                        <td style={bannerStyle}>{tipoPedido.cp_type_order_meaning}</td>
                                        <td style={bannerStyle}>{tipoPedido.cp_type_order_description}</td>

                                        <td style={bannerStyle2}>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <button onClick={() => handleEditClick(tipoPedido.cp_type_order_id)} className='Edit-Iva '>
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
                        <Form >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" >
                                <Form.Label>% IVA</Form.Label>
                                <Form.Control
                                    type="text"

                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_type_order_meaning}
                                    onChange={(e) => setcp_Type_Order_Meaning(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" >
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"

                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_type_order_meaning}
                                    onChange={(e) => setcp_Type_Order_Meaning(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Finalización</Form.Label>
                                <Form.Control
                                    type="date"

                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_type_order_description}
                                    onChange={(e) => setcp_Type_Order_Description(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className='Edit-iva' >
                        <Button className='Guardar-btn-iva' onClick={(e) => saveOrUpdateTypeOrder(setcp_Type_Order_Id)}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header className='Crear-iva' closeButton>
                        <Modal.Title>CREAR</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Crear-iva' >
                        <Form >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" >
                                <Form.Label>% IVA</Form.Label>
                                <Form.Control
                                    type="text"

                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_type_order_meaning}
                                    onChange={(e) => setcp_Type_Order_Meaning(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Descripción"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_type_order_description}
                                    onChange={(e) => setcp_Type_Order_Description(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Finalización</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Descripción"
                                    autoFocus
                                    required // Hacer que este campo sea obligatorio
                                    value={cp_type_order_description}
                                    onChange={(e) => setcp_Type_Order_Description(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className='Crear-iva' >
                        <Button className='Guardar-btn-iva' onClick={(e) => saveOrUpdateTypeOrder(e)}>
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Image className='Img-Creamos_iva' src={imagenes.Creamos} />
            </div>
        </>
    );
    {
    }

};

export default DataIva;