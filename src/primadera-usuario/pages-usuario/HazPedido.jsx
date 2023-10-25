import BannerUser from './BannerUsuario';
import './HazPedido.css';
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
import Button from 'react-bootstrap/Button';
import FiltroInven from './Filtro';
import { FaShoppingCart, FaUser, FaSearchMinus, FaTruck } from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import ItemService from '../../services/ItemService';
import ShopingCartService from '../../services/ShopingCartService';
import OrderService from '../../services/OrderService';
import ShopingCartLineService from '../../services/ShopingCartLineService';
import OrderLineService from '../../services/OrderLineService';

const DataPedido = () => {
    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuarioTelefono, setUsuarioTelefono] = useState([]);
    const [usuarioEmpresa, setUsuarioEmpresa] = useState([]);
    const [usuarioId, setUsarioId] = useState([]);
    const [CustAccountId, setCustAccountId] = useState([]);
    const [PartyId, setPartyId] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseid = await SesionUsername();
                setUarioSesion(responseid.data.cp_name);
                setUsuarioCorreo(responseid.data.username);
                setUsuarioTelefono(responseid.data.cp_cell_phone);
                setUsuarioEmpresa(responseid.data.cust_name);
                setUsarioId(responseid.data.cp_user_id);
                setCustAccountId(responseid.data.cust_account_id);
                setPartyId(responseid.data.party_id);

            } catch (error) {
                console.log(error);
                alert("Error obtener usuario de sesion");
                // Manejar el error apropiadamente, por ejemplo, redirigir o mostrar un mensaje de error.
            }
        };

        fetchData();
    }, [navigate]);

    const SesionUsername = async () => {
        if (LoginService.isAuthenticated()) {
            const read = Cookies.get();
            try {
                const responseid = await UserService.getUserByUsername(read.portal_sesion);
                return responseid;
            } catch (error) {
                console.log(error);
                throw error;
            }
        } else {
            LoginService.logout();
            navigate('/');
            throw new Error("Usuario no autenticado");
        }
    };

    const [ArticulosSinDisponibilidad, setArticulosSinDisponibilidad] = useState([]);
    useEffect(() => {
        if (PartyId) {
            itemsSinDisponibildad(PartyId);
        }
    }, [PartyId]);

    const itemsSinDisponibildad = async (custid) => {
        try {
            const response = await ItemService.getItemsSinDisponibilidad(custid);
            setArticulosSinDisponibilidad(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

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

    //Crear Carrito de Compra
    const [carrito, setcarrito] = useState([]);
    const [orden, setorden] = useState([]);
    const carritoCompra = (articulo, contador) => {
        if (contador == undefined) {
            alert("Por Favor seleccionar cantidad")
        } else {


            const cp_user_id = usuarioId;
            const cust_account_id = CustAccountId;
            const site_use_id = 0;
            const cp_cart_status = 'En Proceso';
            const carrocabecera = { cust_account_id, site_use_id, cp_user_id, cp_cart_status }
            ShopingCartService.getCarritoxUserId(cust_account_id, cp_user_id).then(carrouseridresponse => {
                setcarrito(carrouseridresponse.data);
                console.log(carrouseridresponse.data);
                if (carrouseridresponse.data.length == 0) {
                    ShopingCartService.InsertarCabecera(carrocabecera).then(carrocabeceraresponse => {
                        console.log(carrocabeceraresponse.data)

                        const cp_cart_id = carrocabeceraresponse.data.cp_cart_id;
                        const cp_order_status = carrocabeceraresponse.data.cp_cart_status;
                        const cp_order_num = "1";
                        const cabeceraorder = { cust_account_id, cp_user_id, cp_cart_id, cp_order_status, cp_order_num }
                        OrderService.InsertarOrder(cabeceraorder).then(ordercabeceraresponse => {

                            console.log(ordercabeceraresponse.data)

                            const inventory_item_id = articulo[0].inventory_item_id;
                            const cp_cart_line_number = 1;
                            const cp_cart_Quantity_units = contador;
                            const cp_cart_Quantity_packages = Math.floor(contador / articulo[0].atribute9);
                            const cp_cart_Quantity_volume = contador * articulo[0].atribute8;
                            const lineCarrito = { inventory_item_id, cp_cart_id, cp_cart_line_number, cp_cart_Quantity_volume, cp_cart_Quantity_units, cp_cart_Quantity_packages };
                            ShopingCartLineService.postLineaCarrito(lineCarrito).then(lineCarritoresponse => {
                                console.log(lineCarritoresponse.data)

                                const cp_order_id = ordercabeceraresponse.data.cp_order_id;
                                const cp_order_Quantity_units = lineCarritoresponse.data.cp_cart_Quantity_units;
                                const cp_order_line_number = lineCarritoresponse.data.cp_cart_line_number;
                                const cp_order_Quantity_volume = lineCarritoresponse.data.cp_cart_Quantity_volume;
                                const cp_order_Quantity_packages = lineCarritoresponse.data.cp_cart_Quantity_packages;
                                const lineOrder = { inventory_item_id, cp_order_id, cp_order_Quantity_units, cp_order_line_number, cp_order_Quantity_volume, cp_order_Quantity_packages };

                                OrderLineService.InsertarOrderLine(lineOrder).then(lineOrderresponse => {
                                    console.log(lineOrderresponse.data)
                                    //alert("Carrito creado exitosamente")
                                    setShow(true);
                                }).catch(error => {
                                    console.log(error);
                                    alert("Error al crear linea de orden")
                                })
                            }).catch(error => {
                                console.log(error);
                                alert("Error al crear linea de carrito de compra")
                            })
                        }).catch(error => {
                            console.log(error);
                            alert("Error al crear orden")
                        })
                    }).catch(error => {
                        console.log(error);
                        alert("Error al crear carrito de compra")
                    })
                } else {
                    const cart_id = carrito[0].cp_cart_id;
                    ShopingCartLineService.getLineCarritobyCartId(cart_id).then(obtenerlineasresponse => {
                        console.log(obtenerlineasresponse.data);

                        const cp_cart_id = cart_id;
                        const inventory_item_id = articulo[0].inventory_item_id;
                        let line_number;
                        if (obtenerlineasresponse.data.length === 0) {
                            line_number = 1;
                        } else {
                            const length = obtenerlineasresponse.data.length - 1;
                            line_number = obtenerlineasresponse.data[length].cp_cart_line_number + 1;
                        }
                        const cp_cart_line_number = line_number;
                        const cp_cart_Quantity_units = contador;
                        const cp_cart_Quantity_packages = Math.floor(contador / articulo[0].atribute9);
                        const cp_cart_Quantity_volume = contador * articulo[0].atribute8;
                        const lineCarrito = { inventory_item_id, cp_cart_id, cp_cart_line_number, cp_cart_Quantity_volume, cp_cart_Quantity_units, cp_cart_Quantity_packages };

                        ShopingCartLineService.postLineaCarrito(lineCarrito).then(lineCarritoresponse => {
                            console.log(lineCarritoresponse.data)
                            OrderService.getorderbyCartId(cart_id).then(obtenerordencaridresponse => {
                                console.log(obtenerordencaridresponse.data)
                                const cp_order_id = obtenerordencaridresponse.data[0].cp_order_id;
                                const cp_order_Quantity_units = lineCarritoresponse.data.cp_cart_Quantity_units;
                                const cp_order_line_number = lineCarritoresponse.data.cp_cart_line_number;
                                const cp_order_Quantity_volume = lineCarritoresponse.data.cp_cart_Quantity_volume;
                                const cp_order_Quantity_packages = lineCarritoresponse.data.cp_cart_Quantity_packages;
                                const lineOrder = { inventory_item_id, cp_order_id, cp_order_Quantity_units, cp_order_line_number, cp_order_Quantity_volume, cp_order_Quantity_packages };

                                OrderLineService.InsertarOrderLine(lineOrder).then(lineOrderresponse => {
                                    console.log(lineOrderresponse.data)
                                    //alert("Carrito creado exitosamente")
                                    setShow(true);
                                }).catch(error => {
                                    console.log(error);
                                    alert("Error al crear linea de orden")
                                })
                            }).catch(error => {
                                console.log(error);
                                alert("Error al buscar order id")
                            })
                        }).catch(error => {
                            console.log(error);
                            alert("Error al crear linea de carrito de compra")
                        })
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        }
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

    const PediDatosUser = {
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
            <div className='Back-Pedi' style={backgroundStyle}>
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
                <div className='FondoBlanco_Pedi'>
                    <div className='Buttons_Pedido mt-12'>
                        <button className='btns_pedido p-2 m-2 btn-sm' onClick={() => navigate("/DataTablePerfilUser")}><FaUser /> Perfil</button>
                        <button className='btns_pedido p-2 m-2 btn-sm' onClick={() => navigate("/DataInventario")}> <FaSearchMinus /> Inventario Disponible</button>
                        <button className='btns_pedido p-2 m-2 btn-sm' onClick={() => navigate("/DataPedido")}> <FaShoppingCart /> Haz tu pedido</button>
                        <button className='btns_pedido p-2 m-2 btn-sm'> <FaTruck /> Consulta tu pedido</button>
                    </div>

                    <div style={PediDatosUser}>
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
                                <td>
                                    <tr><th>{usuarioSesion}</th></tr>
                                    <tr> {usuarioEmpresa} </tr>
                                    <tr>{usuarioCorreo}</tr>
                                    <tr>{usuarioTelefono}</tr>
                                </td>
                            </td>
                        </tr>
                    </div>
                    <div className='ContenedorPadrePedi'>
                        <div className='Filtro'>
                            <h3>Filtros</h3>
                            <FiltroInven
                                opciones={opcionesDropdown}
                                checkboxOpciones={opcionesCheckbox}
                                onFilter={handleFilter}
                            />
                        </div>
                        <div className='organiza_articulos row rows-cols1 row-cols-md-3'>
                            {ArticulosSinDisponibilidad
                                .map(articulo => (
                                    <td key={articulo[0].inventory_item_id}>
                                        <div className='organiza_img_y_cont'>
                                            <img className='Borde_imagenes'
                                                src={imagenes.Arboles}
                                                alt=""
                                                style={{ width: '200px', height: '270px' }}
                                            />
                                            <div className='organiza_texto'>
                                                <tr>CÓDIGO ARTÍCULO:{articulo[0].item_number}</tr>
                                                <tr><strong>{articulo[0].item_description_long}</strong></tr>
                                                <tr><strong>Precio: ${articulo[1].unit_price.toLocaleString('es-ES', { style: 'currency', currency: articulo[1].currency_code })}</strong></tr>
                                                <div className='organiza_iva_inc'>
                                                    <tr>${(articulo[1].unit_price * 0.19).toLocaleString('es-ES', { style: 'currency', currency: articulo[1].currency_code })} IVA INCLUIDO</tr>
                                                </div>
                                                <div className='organiza_btn_carro'>
                                                    <Button onClick={() => carritoCompra(articulo, contadores[articulo[0].inventory_item_id])} className='btn_agregar_carro'>
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

                                                    <tr>Unidades por paquete{" " + + articulo[0].atribute9}</tr>

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
                <Image className='Img-Creamos_Inv' src={imagenes.Creamos} />
            </div>{/*AJUSTE LCPG*/}
        </>
    );
};

export default DataPedido;