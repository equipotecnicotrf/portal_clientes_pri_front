import BannerUser from './BannerUsuario';
import './FinalizarCompra.css';
import imagenes from "../../assets/imagenes";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import UserService from '../../services/UserService';
import { FaShoppingCart, FaStar, FaTruck, FaUser, FaSearchMinus } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import { Modal, Form, Dropdown } from 'react-bootstrap';

const FinalizarCompra = () => {

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

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDirecciones, setFilteredDirecciones] = useState([]);

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const filtered = productos.filter((productos) =>
            productos.direccion.toLowerCase().includes(searchTerm)
        );
        setFilteredDirecciones(filtered);
    };
    const handleDireccionSelect = (direccion) => {
        setDireccionCliente(direccion);
        setSearchTerm('');

    };

    const backgroundStyle = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F9F7F7',
    };

    const FinalizarDatosUser = {
        padding: '60px',
        height: '27vh',
        marginTop: '-40px'
    };

    const info_general_items = {
        border: 'none',
        backgroundColor: '#BFBFBF',
        color: 'white'
    };

    const bannerStyle_compra = {
        textAlign: 'left',
        marginTop: '10px',
        marginLeft: '14.5px',
        width: '370px',
        backgroundColor: '#F9F7F7',

    };

    const Style_tables = {

        backgroundColor: '#D9D9D9',

    };

    const productos = [
        {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'calle 128 f 000', num_orden: '123456'
        }, {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'calle 300 f 000', num_orden: '123456'
        }, {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'calle 400 f 000', num_orden: '123456'
        }, {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'calle 500 f 000', num_orden: '123456'
        }, {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'calle 600 f 000', num_orden: '123456'
        }, {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'carrera 700 f 000', num_orden: '123456'
        }, {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'calle 800 f 000', num_orden: '123456'
        }, {
            nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10',
            precio: '$9000.99', cantidad: '25',
            direccion: 'avenida 900 f 000', num_orden: '123456'
        }
    ];

    const totales = [
        { subtotal: '$18.00000000000000000', iva: '$5.5555555555', total: '20.000000000' },
    ]

    const items = [
        { total: '$1.000.000', cantidad_items: '55', m3: '2020' },
    ]

    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <BannerUser />

                <button className='Info_general_compra'><FaShoppingCart className='tamano_carro_principal_compra' />
                    <div className='Info_general_compra_2'>

                        <table className='table table-borderless' >
                            <thead >

                            </thead>
                            <tbody >
                                {items
                                    .map((items) => (
                                        <tr style={info_general_items}>

                                            <td style={info_general_items}>
                                                <tr style={info_general_items}><strong>{items.total}</strong></tr>
                                                <tr style={info_general_items}><strong>{items.cantidad_items} items(s)</strong></tr>
                                                <tr style={info_general_items}><strong>m3 </strong></tr>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>
                </button>

                <div className='FondoBlanco_compra'>

                    <div className='Buttons_compra mt-12'>
                        <button className='btns_compra p-2 m-2 btn-sm' onClick={() => navigate("/DataTablePerfilUser")}><FaUser /> Perfil</button>
                        <button className='btns_compra p-2 m-2 btn-sm' onClick={() => navigate("/DataInventario")}><FaSearchMinus /> Inventario Disponible</button>
                        <button className='btns_compra p-2 m-2 btn-sm'><FaShoppingCart /> Haz tu pedido</button>
                        <button className='btns_compra p-2 m-2 btn-sm'><FaTruck /> Consulta tu pedido</button>
                    </div>

                    <div style={FinalizarDatosUser}>
                        <tr>
                            <td style={{ verticalAlign: 'middle' }}><Container>
                                <Row>
                                    <Col xs={6} md={4}>
                                        <Image className='Img-Admin' src={imagenes.Arboles} roundedCircle />
                                    </Col>
                                </Row>
                            </Container>
                            </td>
                            <td>
                                <tr><th>{usuarioSesion}</th></tr>
                                <tr> Empresa </tr>
                                <tr>{usuarioCorreo}</tr>
                                <tr>Telefono</tr>
                            </td>
                        </tr>
                    </div>


                    <div className='ContenedorPadre_compra'>
                        <FaShoppingCart className='tamano_carro_compra' />

                        <div className='direccion_envio'>
                            <FaTruck className='tamano_carro_compra_2' /><h5 className='tamano_direccion'> <strong>DIRECCIÓN DE ENVÍO</strong></h5>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">

                                <Dropdown>
                                    <Dropdown.Toggle className="buscador mb-3" style={{ color: 'black' }} controlId="exampleForm.ControlInput4" id="dropdown-basic">
                                        {selectedDireccion ? selectedDireccion.accountName : 'Escoge tu dirección'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar dirección"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        {filteredDirecciones.map((direccion) => (
                                            <Dropdown.Item
                                                key={productos.direccion}
                                                onClick={() => handleDireccionSelect(direccion)} >
                                                {direccion.direccion}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </div>

                        <div className='resumen_pedido'>
                            <div>
                                <FaShoppingCart className='tamano_carro_resumen' /><h5 className='tamano_resumen'> <strong>RESUMEN DE TU PEDIDO</strong></h5>
                            </div>
                            <div className='tables'>
                                <table className='table table-borderless' style={bannerStyle_compra}>
                                    <thead >
                                        <tr style={{ textAlign: 'center' }}>
                                            <th style={Style_tables}></th>
                                            <th style={Style_tables}></th>
                                            <th style={Style_tables}>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {productos
                                            .map((productos) => (
                                                <tr>
                                                    <td style={Style_tables}>< FaStar /></td>
                                                    <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>
                                                        <tr style={Style_tables}>{productos.nombre}</tr>
                                                        <tr style={Style_tables}>{productos.descripcion}</tr>
                                                        <tr style={Style_tables} >CANTIDADES: {productos.cantidad}</tr>
                                                    </td>
                                                    <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>{productos.precio}
                                                    </td>

                                                </tr>
                                            ))}

                                    </tbody>
                                </table>

                            </div>
                            <div className='tables'>
                                <table className='table table-borderless' style={bannerStyle_compra}>
                                    <thead>
                                        <tr></tr>
                                    </thead>
                                    <tbody>
                                        {totales.map((totales, index) => (
                                            <React.Fragment key={index}>
                                                <tr className="borde_horizontal" >
                                                </tr>
                                                <tr >
                                                    <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>Subtotal</td>
                                                    <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>{totales.subtotal}</td>
                                                </tr>
                                                <tr className="borde_horizontal">
                                                    <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>IVA</td>
                                                    <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>{totales.iva}</td>
                                                </tr>
                                                <tr >
                                                    <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>Total</td>
                                                    <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>{totales.total}</td>
                                                </tr>
                                                {index === 1 && (
                                                    <tr className="borde_horizontal" key="borde_horizontal">
                                                        <td colSpan="3"></td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                            <div className='centrar_boton_confirmar'>
                                <Button onClick={handleShow} className='btns_carrito_conf_compra' >Confirmar orden   </Button>
                            </div>
                        </div>

                        <Modal show={show} onHide={handleClose} centered className='ancho_modal_finalizar' >
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body className='modal_principal_finalizar' >
                                <div className='modal-frase-finalizar'>
                                    <FaTruck className='centrar_carrito_finalizar' />
                                    <h5><strong>Su ORDEN # 12345658 </strong></h5>
                                    <h5><strong> HA SIDO CREADA</strong></h5>
                                    <h5><strong>_______________________</strong></h5>
                                    <p><strong>Su pedido será confirmado después de las validaciones de cupo y cartera por medio de un correo electrónico.</strong></p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer ></Modal.Footer>
                        </Modal>

                    </div>

                </div >

                <Image className='Img-Creamos_carrito' src={imagenes.Creamos} />
            </div >
        </>
    );
};

export default FinalizarCompra;