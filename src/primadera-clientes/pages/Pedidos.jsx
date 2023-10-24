import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/Pedidos.css';
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
import { FaHome, FaRegEdit, FaTruck } from "react-icons/fa";

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

    //consulta por ID
    const ConsultarTipoPedidoPorId = (typeOrderId) => {
        TypeOrderService.getTypeOrderById(typeOrderId).then((response) => {
            setcp_Type_Order_Description(response.data.cp_type_order_description);
            setcp_Type_Order_Meaning(response.data.cp_type_order_meaning);
            setcp_Type_Order_Status(response.data.cp_type_order_status);
            // Aquí establece el estado de los checkboxes en función del valor de cp_type_order_status
            if (response.data.cp_type_order_status === "Activo") {
                setCheckbox3(true); // Activo
                setCheckbox2(false)
            } else {
                setCheckbox3(false); // Inactivo
                setCheckbox2(true)
            }
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
            saveOrUpdateTypeOrder();
        }

        setValidated(true);
    }

    const saveOrUpdateTypeOrder = (e) => {

        if (editTypeOrderId) {
            // Update an existing record
            const cp_type_order_status = (checkbox3 ? "Activo" : checkbox2 ? "Inactivo" : cp_type_order_status);
            const typeOrder_edit = { cp_type_order_description, cp_type_order_meaning, cp_type_order_status };
            TypeOrderService.updateTypEOrder(editTypeOrderId, typeOrder_edit).then((response) => {
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
            const existingType = tipoPedido.find(item => item.cp_type_order_description === cp_type_order_description || item.cp_type_order_meaning === cp_type_order_meaning);

            if (existingType) {
                alert("Ya existe un tipo de pedido con el mismo nombre.");
            } else {
                const typeOrder = {
                    cp_type_order_description,
                    cp_type_order_meaning,
                    cp_type_order_status: "Activo",
                };
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
                        alert("Error al crear Tipo Pedido, Por favor diligenciar todos los campos")
                    });
            }
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

    const pedido = {
        padding: '20px',
    };

    const pedido2 = {
        padding: '60px',
        height: '23vh',
        marginTop: '-35px'
    };

    /*AJUSTE LCPG INI*/



    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [checkbox3, setCheckbox3] = useState(false);
    const [editShow, editSetShow] = useState(false);

    const handleCheckbox1Change = () => {
        setCheckbox1();
    };
    const handleCheckbox2Change = () => {
        setCheckbox2(true);
        setCheckbox3(false);
    };
    const handleCheckbox3Change = (event) => {
        setCheckbox2(false);
        setCheckbox3(true);
        setIsChecked(event.target.checked);
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

    /*AJUSTE LCPG FIN*/

    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <Banner />
                <div style={pedido2}>
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

                <div className='DataTable' style={bannerStyle}>
                    <th style={pedido}><FaTruck /> GESTIONAR TIPO DE PEDIDOS</th> {/*AJUSTE LCPG*/}
                    <table className='table table-bordered' >
                        <thead style={bannerStyle} >
                            <tr style={bannerStyle} className='borderless_ped'>
                                <th style={bannerStyle} className='borderless_ped'>Código</th>
                                <th style={bannerStyle}>Tipo Pedido</th>
                                <th style={bannerStyle}>Descripción</th>
                                <th style={bannerStyle}>Estado</th>
                                <th style={bannerStyle} className='borderless_ped'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={bannerStyle}>
                            {tipoPedido
                                .toSorted((a, b) => a.cp_type_order_id - b.cp_type_order_id) // Ordena el arreglo por cp_type_order_id en orden ascendente
                                .map((tipoPedido) => (
                                    <tr style={bannerStyle} className='borderless_ped' key={tipoPedido.cp_type_order_id}>
                                        <td style={bannerStyle} className='borderless_ped'>{tipoPedido.cp_type_order_id}</td>
                                        <td style={bannerStyle}>{tipoPedido.cp_type_order_meaning}</td>
                                        <td style={bannerStyle}>{tipoPedido.cp_type_order_description}</td>
                                        <td style={bannerStyle}>
                                            {/*AJUSTE LCPG INI*/}
                                            <Form className='CheckBox_ped_2'>
                                                <Form.Group>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={tipoPedido.cp_type_order_status === "Activo"}
                                                        onChange={() => handleCheckbox1Change(tipoPedido.cp_type_order_id)}
                                                        label={tipoPedido.cp_type_order_status === "Activo" ? "Activo" : "Inactivo"}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </td>
                                        <td style={bannerStyle2} className='borderless_ped'>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <Button onClick={() => handleEditClick(tipoPedido.cp_type_order_id)} className='Edit-ped'>
                                                <FaRegEdit />
                                            </Button>
                                        </td>
                                        {/*AJUSTE LCPG FIN*/}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="botones mt-12">
                    <Button className="boton_crear_pedi p-2 m-2 btn-sm" onClick={handleShow}>Crear</Button> {/*AJUSTE LCPG*/}
                </div>




                {/*AJUSTE LCPG INI*/}

                <Modal show={editShow} onHide={handleEditClose}>
                    <Modal.Header className='Edit-ped' closeButton>
                        <Modal.Title><FaRegEdit className='btn_faregedit_ped' /> MODIFICAR DATOS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Edit-ped' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Código</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Código"
                                    autoFocus
                                    disabled
                                    value={cp_type_order_id}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                                <Form.Label>Tipo Pedido</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo Pedido"
                                    autoFocus
                                    value={cp_type_order_meaning}
                                    onChange={(e) => setcp_Type_Order_Meaning(e.target.value)}
                                    required // Hacer que este campo sea obligatorio
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el tipo de pedido</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripción"
                                    autoFocus
                                    value={cp_type_order_description}
                                    onChange={(e) => setcp_Type_Order_Description(e.target.value)}
                                    required // Hacer que este campo sea obligatorio
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la Descripción tipo de pedido</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <div className='CheckBox_ped'> {/*23-10-2023*/}
                                <Form className='CheckBox_ped'> {/*23-10-2023*/}
                                    <Form.Group className='Checkbox_estado_ped'> {/*23-10-2023*/}
                                        <Form.Check type="checkbox">
                                            <Form.Check.Label>Inactivo</Form.Check.Label>
                                            <Form.Check.Input checked={checkbox2} onChange={handleCheckbox2Change}
                                            />
                                        </Form.Check>
                                    </Form.Group>
                                    <Form.Group className='Checkbox_estado_ped'> {/*23-10-2023*/}
                                        <Form.Check type="checkbox">
                                            <Form.Check.Label>Activo</Form.Check.Label>
                                            <Form.Check.Input checked={checkbox3} onChange={handleCheckbox3Change} />
                                        </Form.Check>
                                    </Form.Group>
                                </Form>
                            </div> {/*AJUSTE LCPG FIN*/}
                            <Modal.Footer className='Edit-ped' >
                                <Button className='Guardar-btn-ped' type='submit'>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>




                <Modal show={show} onHide={handleClose}>
                    <Modal.Header className='Crear-ped' closeButton>
                        <Modal.Title>CREAR TIPO PEDIDO</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='Crear-ped' >
                        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Tipo Pedido</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tipo Pedido"
                                    autoFocus
                                    value={cp_type_order_meaning}
                                    onChange={(e) => setcp_Type_Order_Meaning(e.target.value)}
                                    required // Hacer que este campo sea obligatorio
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el tipo de pedido</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3" disabled>
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripción"
                                    autoFocus
                                    value={cp_type_order_description}
                                    onChange={(e) => setcp_Type_Order_Description(e.target.value)}
                                    required // Hacer que este campo sea obligatorio
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la Descripción tipo de pedido</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Modal.Footer className='Crear-ped' >
                                <Button className='Guardar-btn-ped' type='submit'>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>



                <Image className='Img-Creamos_ped' src={imagenes.Creamos} />
            </div>


            {/*AJUSTE LCPG*/}
            {/*AJUSTE LCPG FIN*/}
        </>
    );

};

export default DataTable;