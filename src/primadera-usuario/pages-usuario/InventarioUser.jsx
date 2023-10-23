import BannerUser from './BannerUsuario';
import './InventarioUser.css';
import imagenes from "../../assets/imagenes";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import UserService from '../../services/UserService';
import ItemService from '../../services/ItemService';
import TypeOrderService from '../../services/TypeOrderService';
import Button from 'react-bootstrap/Button';
import FiltroInven from './Filtro';
import { FaShoppingCart, FaUser, FaSearchMinus, FaTruck } from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import ShopingCartService from '../../services/ShopingCartService';

const DataInventario = () => {
    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuarioTelefono, setUsuarioTelefono] = useState([]);
    const [usuarioEmpresa, setUsuarioEmpresa] = useState([]);
    const [usuarioId, setUsarioId] = useState([]);
    const [CustAccountId, setCustAccountId] = useState([]);
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
                setUsuarioEmpresa(responseid.data.cust_name);
                setUsarioId(responseid.data.cp_user_id)
                setCustAccountId(responseid.data.cust_account_id)
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

    // Traer información de disponibilidad y unirla con los artículos disponibles
    const [ArticulosConDisponibilidad, setArticulosConDisponibilidad] = useState([]);
    useEffect(() => {
        ListArticulosConDisponibilidad();
    }, []);

    const ListArticulosConDisponibilidad = async () => {
        ItemService.getItemsConDisponibilidad().then(response => {
            setArticulosConDisponibilidad(response.data)
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        })
    };



    const items = [
        { total: '$0.000.000', cantidad_items: '55', m3: '2020' },

    ]

    const info_general_items = {
        border: 'none',
        backgroundColor: '#767373',
        color: 'white',
    };

    // Define un estado para los contadores de cada artículo
    const [contadores, setContadores] = useState({});

    const incrementarContador = (inventory_item_id, atribute9) => {
        setContadores(prevContadores => {
            const nuevoContador = { ...prevContadores };
            nuevoContador[inventory_item_id] = (nuevoContador[inventory_item_id] || 0) + atribute9;
            return nuevoContador;
        });
    };

    const decrementarContador = (inventory_item_id, atribute9) => {
        setContadores(prevContadores => {
            const nuevoContador = { ...prevContadores };
            if (nuevoContador[inventory_item_id] > 0) {
                nuevoContador[inventory_item_id] -= atribute9;
            }
            return nuevoContador;
        });
    };

    //

    //Crear Carrito de Compra
    const carritoCompra = () => {
        const cp_user_id = usuarioId;
        const cust_account_id = CustAccountId;
        const site_use_id = 0;
        const cp_cart_status = 'En Proceso';
        const carrocabecera = { cust_account_id, site_use_id, cp_user_id, cp_cart_status }
        ShopingCartService.InsertarCabecera(carrocabecera).then(carrocabeceraresponse => {
            console.log(carrocabeceraresponse.data)
        }).catch(error => {
            console.log(error);
        })

    }

    const backgroundStyle = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    };

    const InveDatosUser = {
        padding: '60px',
        height: '27vh',
        marginTop: '-40px'
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
    const Datos_usuario = {
        position: 'absolute',
        top: '50%',
        left: '14.5%',
        transform: 'translate (-50%, -50%)',
    };

    const opcionesDropdown = ['Opción 1', 'Opción 2', 'Opción 3'];
    const opcionesCheckbox = ['Checkbox 1', 'Checkbox 2', 'Checkbox 3'];

    const handleFilter = (filtros) => {
        // Aquí debes implementar la lógica para filtrar según las opciones seleccionadas
        console.log('Filtros seleccionados:', filtros);
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                <div className='FondoBlanco_inv'>
                    <div className='Buttons_Inventario mt-12'>
                        <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataTablePerfilUser")}><FaUser /> Perfil</button>
                        <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataInventario")}><FaSearchMinus /> Inventario Disponible</button>
                        <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataPedido")}><FaShoppingCart /> Haz tu pedido</button>
                        <button className='btns_inventario p-2 m-2 btn-sm'><FaTruck /> Consulta tu pedido</button>
                    </div>
                    <div style={InveDatosUser}>
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
                                <tr> {usuarioEmpresa} </tr>
                                <tr>{usuarioCorreo}</tr>
                                <tr>{usuarioTelefono}</tr>
                            </td>
                        </tr>
                    </div>





                    <div className='ContenedorPadre'>
                        <div className='Filtro'>
                            <h3>Filtros</h3>
                            <FiltroInven
                                opciones={opcionesDropdown}
                                checkboxOpciones={opcionesCheckbox}
                                onFilter={handleFilter}
                            />
                            {/* Resto de tu aplicación */}
                        </div>
                        <div className='organiza_articulos row rows-cols1 row-cols-md-3'>
                            {ArticulosConDisponibilidad
                                .toSorted((a, b) => a[0].inventory_item_id - b[0].inventory_item_id) // Ordena el arreglo por cp_user_id en orden ascendente
                                .map((articulo) => (
                                    <td key={articulo[0].inventory_item_id}>
                                        <div className='organiza_img_y_cont'>
                                            <img className='Borde_imagenes'
                                                src={imagenes.Arboles}
                                                alt=""
                                                style={{ width: '200px', height: '270px' }}
                                            />
                                            <div className='organiza_texto'>
                                                <tr>CÓDIGO ARTÍCULO: {articulo[0].item_number} </tr>
                                                <tr><strong>{articulo[0].item_description_long}</strong></tr>
                                                <div className='organiza_cant_disp'>
                                                    <tr>Cantidad disponible: {articulo[1].available_to_transact}</tr>
                                                </div>
                                                <tr><strong>Precio: "precio"</strong></tr>
                                                <div className='organiza_iva_inc'>
                                                    <tr>"precio" IVA INCLUIDO</tr>
                                                </div>
                                                <div className='organiza_btn_carro'>
                                                    <Button onClick={handleShow} className='btn_agregar_carro'>
                                                        <FaShoppingCart /><span> Agregar</span>
                                                    </Button>
                                                </div>
                                                <div className='principal_contador'>
                                                    <td>
                                                        <div className="contador-box">
                                                            {contadores[articulo[0].inventory_item_id] || 0}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Col><Button className='decre_incre' onClick={() => incrementarContador(articulo[0].inventory_item_id, articulo[0].atribute9)}>+</Button></Col>
                                                        <Col><Button className='decre_incre' onClick={() => decrementarContador(articulo[0].inventory_item_id, articulo[0].atribute9)}>-</Button></Col>
                                                    </td>
                                                </div>
                                                <div className='organiza_uni_paq'>
                                                    <tr>Unidades por paquete{" " + articulo[0].atribute9}</tr>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                ))}
                        </div>
                        <Modal show={show} onHide={handleClose} backdrop="static" centered size='sm'>
                            <Modal.Header className='modal_principal' closeButton>
                            </Modal.Header>
                            <Modal.Body className='modal_principal'  >
                                <div className='modal-frase' >
                                    <h5>Artículo agregado al carrito</h5>
                                </div>
                                <div className='modal-carrito' >
                                    <a onClick={() => navigate("/CarritoCompras")} target="_blank" rel="noopener noreferrer">
                                        <th>Ver carrito</th>
                                    </a>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
                <Image className='Img-Creamos_ped' src={imagenes.Creamos} />
            </div>{/*AJUSTE LCPG*/}
        </>
    );
};

export default DataInventario;