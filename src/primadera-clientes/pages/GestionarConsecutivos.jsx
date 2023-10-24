import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/GestionarConsecutivos.css';
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

    const [validated, setValidated] = useState(false);
    const [validated2, setValidated2] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };


    const handleSubmit2 = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated2(true);
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

    const data_cons =
        [
            {
                id: '1', codigo: 'PRI', numero_cons: '1000', fecha_ini: '10-10-2023', fecha_fin: '10-10-2023'
            }, {
                id: '2', codigo: 'PRI', numero_cons: '2000', fecha_ini: '10-10-2023', fecha_fin: '10-10-2023'
            }, {
                id: '3', codigo: 'PRI', numero_cons: '3000', fecha_ini: '10-10-2023', fecha_fin: '10-10-2023'
            }
        ]


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

                            {data_cons
                                .map((data_cons) => (
                                    <tr className='borderless_cons' style={bannerStyle} key={data_cons.id}>
                                        <td style={bannerStyle}>{data_cons.id}</td>
                                        <td style={bannerStyle}>{data_cons.codigo}</td>
                                        <td style={bannerStyle}>{data_cons.numero_cons}</td>
                                        <td style={bannerStyle}>{data_cons.fecha_ini}</td>
                                        <td style={bannerStyle}>{data_cons.fecha_fin}</td>
                                        <td style={bannerStyle2}>
                                            {/* Call handleEditClick with tipoPedido.cp_type_order_id */}
                                            <Button onClick={handleShow} className='Edit_cons'>
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
                        <Form noValidate validated={validated} onSubmit={handleSubmit}  >
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="ID"
                                    autoFocus
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Código Consecutivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Código Consecutivo"
                                    autoFocus
                                    required
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
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el número del consecutivo</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}

                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Fecha Inicio"
                                    autoFocus
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de inicio</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Fecha Fin"
                                    autoFocus
                                    required
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
                        <Form noValidate validated={validated2} onSubmit={handleSubmit2}  >

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Código Consecutivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Código Consecutivo"
                                    autoFocus
                                    required
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
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa el número del consecutivo</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Fecha Inicio"
                                    autoFocus
                                    required
                                />
                                <Form.Control.Feedback type="invalid">Por favor ingresa la fecha de inicio</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Fecha Fin"
                                    autoFocus
                                    required
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