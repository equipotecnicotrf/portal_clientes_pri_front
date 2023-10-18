import BannerUser from './BannerUsuario';
import './CarritoCompra.css';
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
import { FaShoppingCart, FaTrashAlt, FaTruck, FaUser, FaSearchMinus } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';

const CarritoCompras = () => {

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

    const productos = [
        { imagen: 'Arboles', nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10', codigo: '0000000', dias_entrega: '5', fecha_entrega: '13-10-2023', precio_unitario: '$9000.99', cantidad: '25', m3: '25', precio_total: '$9.99' },
        { imagen: 'Arboles', nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10', codigo: '0000000', dias_entrega: '5', fecha_entrega: '13-10-2023', precio_unitario: '$9000.99', cantidad: '25', m3: '25', precio_total: '$9.99' },
        { imagen: 'Arboles', nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10', codigo: '0000000', dias_entrega: '5', fecha_entrega: '13-10-2023', precio_unitario: '$9000.99', cantidad: '25', m3: '25', precio_total: '$9.99' },

    ];

    const [contador, setContador] = useState(0);

    const incrementarContador = () => {
        setContador(contador + 1);
    };

    const decrementarContador = () => {
        if (contador > 0) {
            setContador(contador - 1);
        }
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => {
        setShow(false);
        setShow2(true);
    }

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

    const CarritoDatosUser = {
        padding: '60px',
        height: '27vh',
        marginTop: '-40px'
    };

    const bannerStyle_carrito = {
        textAlign: 'center',
        marginTop: '10px',
        backgroundColor: '#F9F7F7',

    };
    const bannerStyle_carrito2 = {
        textAlign: 'center',
        marginTop: '10px',
        backgroundColor: '#F9F7F7',

    };
    const cellStyle = {
        border: 'none',
        backgroundColor: '#F9F7F7',
    };

    const cellStyle2 = {
        border: 'none',
        backgroundColor: '#DDDBDB',
    };

    const info_general_items = {
        border: 'none',
        backgroundColor: '#767373',
        color: 'white',
    };

    const items = [
        { total: '$0.000.000', cantidad_items: '55', m3: '2020' },
    ];
    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <BannerUser />
                <button className='Info_general'><FaShoppingCart className='tamanio_carro_principal' onClick={() => navigate("/CarritoCompras")} />
                    <div className='Info_general_2'>

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

                <div className='FondoBlanco_carrito'>

                    <div className='Buttons_Carrito mt-12'>
                        <button className='btns_carrito p-2 m-2 btn-sm' onClick={() => navigate("/DataTablePerfilUser")}><FaUser /> Perfil</button>
                        <button className='btns_carrito p-2 m-2 btn-sm' onClick={() => navigate("/DataInventario")}><FaSearchMinus /> Inventario Disponible</button>
                        <button className='btns_carrito p-2 m-2 btn-sm' onClick={() => navigate("/DataPedido")}><FaShoppingCart /> Haz tu pedido</button>
                        <button className='btns_carrito p-2 m-2 btn-sm'><FaTruck /> Consulta tu pedido</button>
                    </div>

                    <div style={CarritoDatosUser}>
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


                    <div className='ContenedorPadre_carrito'>
                        <div className='bordes_tabla' >
                            <table className='table' style={bannerStyle_carrito} >
                                <thead >
                                    <tr style={bannerStyle_carrito} >
                                        <th style={bannerStyle_carrito}><FaShoppingCart className='tamaño_carro' />  CARRITO DE COMPRAS</th>
                                        <th style={bannerStyle_carrito}>Precio Unitario</th>
                                        <th style={bannerStyle_carrito}>Cantidad</th>
                                        <th style={bannerStyle_carrito}>M3</th>
                                        <th style={bannerStyle_carrito}>Precio Total</th>
                                        <th style={bannerStyle_carrito}></th>
                                    </tr>
                                </thead>

                                <tbody >
                                    {productos
                                        .map((productos) => (
                                            <tr >
                                                <td style={bannerStyle_carrito2}>
                                                    <div >
                                                        <div className='alinea_imagen'>
                                                            <td key={productos.imagen}> <img className='Borde_imagenes_carrito'
                                                                src={imagenes[productos.imagen]}

                                                                style={{ width: '180px', height: '190px' }}

                                                            />
                                                            </td>
                                                        </div>
                                                        <td >
                                                            <div className='Organiza_descripción'>
                                                                <tr style={cellStyle}><strong>{productos.nombre}</strong></tr>
                                                                <tr style={cellStyle}><strong>{productos.descripcion}</strong></tr>
                                                            </div>
                                                            <div className='Organiza_articulo'>
                                                                <tr style={cellStyle}>CÓDIGO ARTíCULO: {productos.codigo}</tr>
                                                            </div>
                                                            <div className='Organiza_entrega'>
                                                                <div><FaTruck className='tamaño-camion' /></div>
                                                                <div className='Organiza_entrega_2'>
                                                                    <tr style={cellStyle2}><strong>ENTREGA EN {productos.dias_entrega} DÍAS</strong></tr>
                                                                    <tr style={cellStyle2}>Fecha de entrega: {productos.fecha_entrega} </tr>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </div></td>

                                                <td style={bannerStyle_carrito2}> <div className='precio_unit'>{productos.precio_unitario}</div></td>
                                                <td style={bannerStyle_carrito2}>
                                                    <div className='principal_contador_carrito'>
                                                        <td>
                                                            <div className="contador-box-carrito">
                                                                {contador}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Col><Button className='decre_incre_carrito' onClick={incrementarContador}>+</Button></Col>
                                                            <Col><Button className='decre_incre_carrito' onClick={decrementarContador}>-</Button></Col>
                                                        </td>
                                                    </div>
                                                </td>
                                                <td style={bannerStyle_carrito2}><div className='metro_cubico'>{productos.m3} </div></td>
                                                <td style={bannerStyle_carrito2}><div className='precio_tot'>{productos.precio_total}</div></td>
                                                <td style={bannerStyle_carrito2}>
                                                    <Button className='btn_eliminar'>
                                                        <FaTrashAlt />
                                                    </Button>

                                                </td>

                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div >
                            <Button className='btns_carrito_seguir'>Seguir comprando   </Button>
                            <Button onClick={handleShow} className='btns_carrito_borrar' >Borrar carrito   </Button>
                            <Button onClick={() => navigate("/FinalizarCompra")} className='btns_carrito_finalizar'>Finalizar compra   </Button>
                        </div>

                        <Modal show={show} onHide={handleClose} centered >
                            <Modal.Body className='modal_principal_carrito' >
                                <div className='modal-frase-carrito'>
                                    <h6><strong>¿Estás seguro de que deseas vaciar tu carrito?</strong></h6>
                                    <Button onClick={handleClose} className='btns_carrito_cancelar' >Cancelar</Button>
                                    <Button onClick={handleShow2} className='btns_carrito_confirmar'>Confirmar</Button>
                                </div>
                            </Modal.Body>
                        </Modal>

                        <Modal show={show2} onHide={handleClose2} centered className='ancho_modal_2' >
                            <Modal.Body className='modal_principal_sigue' >
                                <div className='modal-frase-sigue'>
                                    <FaShoppingCart className='centrar_carrito' />
                                    <h5><strong>Tu carrito está vacío</strong></h5>
                                    <h5><strong>_______________________</strong></h5>
                                    <p>En <strong>PRIMADERA</strong> tenemos productos increíbles para que elijas el más adecuado.</p>
                                    <Button className='btns_carrito_sigue'>Sigue Comprando</Button>
                                </div>
                            </Modal.Body>
                        </Modal>

                    </div>

                </div>

                <Image className='Img-Creamos_carrito' src={imagenes.Creamos} />
            </div >
        </>
    );
};

export default CarritoCompras;