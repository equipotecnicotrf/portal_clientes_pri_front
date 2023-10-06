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
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import TypeOrderService from '../../services/TypeOrderService';
import UserService from '../../services/UserService';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaHome, FaRegEdit } from "react-icons/fa";

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

    const bannerStyle = {
        backgroundColor: backgroundColor || '#878787',
        color: '#fff',
        padding: '20px',
        textAlign: 'center',
        marginTop: '30px',
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
                        <th style={pedido}>GESTIONAR TIPO DE PEDIDOS</th> {/*AJUSTE LCPG*/}
                        <table className='table table-borderless' >
                            <thead style={bannerStyle}>
                                <tr style={bannerStyle} >
                                    <th style={bannerStyle}>Código</th>
                                    <th style={bannerStyle}>Tipo Pedido</th>
                                    <th style={bannerStyle}>Descripción</th>
                                    <th style={bannerStyle}>Estado</th>
                                    <th style={bannerStyle}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody style={bannerStyle}>
                                {tipoPedido
                                    .toSorted((a, b) => a.cp_type_order_id - b.cp_type_order_id) // Ordena el arreglo por cp_type_order_id en orden ascendente
                                    .map((tipoPedido) => (
                                        <tr style={bannerStyle} key={tipoPedido.cp_type_order_id}>
                                            <td style={bannerStyle}>{tipoPedido.cp_type_order_id}</td>
                                            <td style={bannerStyle}>{tipoPedido.cp_type_order_meaning}</td>
                                            <td style={bannerStyle}>{tipoPedido.cp_type_order_description}</td>
                                            <td style={bannerStyle}>
                                                {/*AJUSTE LCPG INI*/}
                                                <Form className='CheckBox_estado_ped'>

                                                    <Form.Group>
                                                        <Form.Check type="checkbox">
                                                            <Form.Check.Input checked={checkbox1} onChange={handleCheckbox1Change} />
                                                        </Form.Check>
                                                    </Form.Group>

                                                </Form>

                                            </td>
                                            <td style={bannerStyle}>
                                                <button onClick={handleEditShow} className='Edit-ped'>
                                                    <FaRegEdit />
                                                </button>
                                            </td>
                                            {/*AJUSTE LCPG FIN*/}
                                        </tr>
                                    ))}
                            </tbody>

                        </table>
                    </div>
                    <div className="botones mt-12">
                        <Button className="boton1 p-2 m-2 btn-sm" onClick={handleShow}>Crear</Button> {/*AJUSTE LCPG*/}
                    </div>

                    {/*AJUSTE LCPG INI*/}

                    <Modal show={editShow} onHide={handleEditClose}>
                        <Modal.Header className='Edit-ped' closeButton>
                            <Modal.Title>MODIFICAR DATOS</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='Edit-ped' >
                            <Form >
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
                                    <Form.Label>Tipo Pedido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tipo Pedido"
                                        autoFocus
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción"
                                        autoFocus
                                    />
                                </Form.Group>
                                <Form className='CheckBox_estado_ped'>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Group>
                                        <Form.Check type="checkbox">
                                            <Form.Check.Input checked={checkbox2} onChange={handleCheckbox2Change} />
                                        </Form.Check>
                                    </Form.Group>
                                </Form>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className='Edit-ped' >
                            <Button className='Guardar-btn-ped' onClick={handleEditClose}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header className='Crear-ped' closeButton>
                            <Modal.Title>CREAR TIPO PEDIDO</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='Crear-ped' >
                            <Form >

                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                                    <Form.Label>Tipo Pedido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tipo Pedido"
                                        autoFocus
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción"
                                        autoFocus
                                    />
                                </Form.Group>
                                <Form className='CheckBox_estado_ped'>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Group>
                                        <Form.Check type="checkbox">
                                            <Form.Check.Input checked={checkbox3} onChange={handleCheckbox3Change} />
                                        </Form.Check>
                                    </Form.Group>
                                </Form>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className='Crear-ped' >
                            <Button className='Guardar-btn-ped' onClick={handleClose}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Image className='Img-Creamos_ped' src={imagenes.Creamos} />
                </div>
               
           
            {/*AJUSTE LCPG*/}
            {/*AJUSTE LCPG FIN*/}
        </>
    );

};

export default DataTable;