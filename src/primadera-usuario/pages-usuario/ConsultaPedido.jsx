import './ConsultaPedido.css';
import BannerUser from './BannerUsuario';
import imagenes from "../../assets/imagenes";
import { FaShoppingCart, FaUser, FaSearchMinus, FaTruck, FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import LoginService from '../../services/LoginService';
import Cookies from 'js-cookie';
import UserService from '../../services/UserService';
import { Form, Button, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import ConsultOrderService from '../../services/ConsultOrderService';
import ShopingCartService from '../../services/ShopingCartService';
import SoapServiceDirecciones from '../../services/SoapServiceDirecciones';
import TypeOrderService from '../../services/TypeOrderService';
import ItemService from '../../services/ItemService';

const ConsultaPedido = () => {

    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuarioTelefono, setUsuarioTelefono] = useState([]);
    const [usuarioEmpresa, setUsuarioEmpresa] = useState([]);
    const [usuarioId, setUsarioId] = useState([]);
    const [CustAccountId, setCustAccountId] = useState([]);
    const [PartyId, setPartyId] = useState([]);
    const [carrito, setcarrito] = useState([]);
    const [orders, setorders] = useState([]);
    const [transactional_currency_code, settransactional_currency_code] = useState([]);
    const [cp_type_order_id, setcp_type_order_id] = useState([]);
    const [typeOrder, setTypeOrder] = useState([]);
    const [direcciones, setDirecciones] = useState([]);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        SesionUsername();
        Items();
    }, [])

    const SesionUsername = () => {
        if (LoginService.isAuthenticated()) {
            const read = Cookies.get()
            UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                console.log(responseid.data)
                setUarioSesion(responseid.data.cp_name);
                setUsuarioCorreo(responseid.data.username);
                setCustAccountId(responseid.data.cust_account_id);
                setUsarioId(responseid.data.cp_user_id);
                setUsuarioTelefono(responseid.data.cp_cell_phone);
                setUsuarioEmpresa(responseid.data.cust_name);
                setPartyId(responseid.data.party_id);
                settransactional_currency_code(responseid.data.transactional_currency_code);
                setcp_type_order_id(responseid.data.cp_type_order_id);

                ListDirecciones(responseid.data.cust_account_id);
                ConsultarTipoPedidoPorId(responseid.data.cp_type_order_id);

                TypeOrderService.getTypeOrderById(responseid.data.cp_type_order_id).then(consultorderresponse => {
                    const transactionTypeCode = consultorderresponse.data.cp_type_order_description;

                    const creationDateTo = new Date();
                    const yearCreationDateTo = creationDateTo.getFullYear();
                    const monthCreationDateTo = (creationDateTo.getMonth() + 1).toString().padStart(2, '0');
                    const dayCreationDateTo = creationDateTo.getDate().toString().padStart(2, '0');//Para crear ceros a la izquierda
                    //const creationDateToFormateada = '${yearCreationDateTo}-${monthCreationDateTo}-${dayCreationDateTo}';

                    const creationDateFrom = new Date(creationDateTo);
                    creationDateFrom.setDate(creationDateTo.getDate() - 90);

                    const yearCreationDateFrom = creationDateFrom.getFullYear();
                    const monthcreationDateFrom = (creationDateFrom.getMonth() + 1).toString().padStart(2, '0');
                    const daycreationDateFrom = creationDateFrom.getDate().toString().padStart(2, '0');//Para crear ceros a la izquierda

                    const creationDateToFormateada = yearCreationDateTo + "-" + monthCreationDateTo + "-" + dayCreationDateTo;
                    const creationDateFromFormateada = yearCreationDateFrom + "-" + monthcreationDateFrom + "-" + daycreationDateFrom;

                    carritoComprausuario(responseid.data.cust_account_id, responseid.data.cp_user_id);
                    consultaPedidoInicial(responseid.data.party_id, transactionTypeCode, creationDateFromFormateada, creationDateToFormateada);
                    setShow2(true);


                });


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

    const Items = () => {
        ItemService.getAllItems().then(response => {
            setItems(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const consultaPedidoInicial = (buyingPartyId, transactionTypeCode, creationDateFrom, creationDateTo) => {
        ConsultOrderService.getOrdersByCustomer(buyingPartyId, transactionTypeCode, creationDateFrom, creationDateTo).then(consultorderresponse => {
            setorders(consultorderresponse.data);
            setstatusCode("OPEN")
            console.log(consultorderresponse.data);
            setShow2(false);
        }).catch(error => {
            console.log(error);
            setShow2(false);
            console.log("El cliente no tiene pedidos abiertos");
        })
    }

    const getStatusLabel = (status, BillingDate) => {
        const fechaActual = new Date();
        const fechaComparacion = new Date(fechaActual);
        fechaComparacion.setDate(fechaActual.getDate() - 9);
        const yearfechaComparacion = fechaComparacion.getFullYear();
        const monthfechaComparacion = (fechaComparacion.getMonth() + 1).toString().padStart(2, '0');
        const dayfechaComparacion = fechaComparacion.getDate().toString().padStart(2, '0');//Para crear ceros a la izquierda
        const fechaComparacionFormateada = yearfechaComparacion + "-" + monthfechaComparacion + "-" + dayfechaComparacion;

        const fechaFactura = BillingDate ? BillingDate.split('T')[0] : "null";
        switch (status) {
            case "Scheduled":
                return "En programación";
            case "Manual Scheduling Required":
                return "En programación";
            case "Awaiting Shipping":
                return "En consolidación";
            case "Awaiting Billing":
                return "Despachado-Facturado";
            case "Closed":
                if (fechaFactura < fechaComparacionFormateada) {
                    return "Cerrado";
                } else {
                    return "Despachado-Facturado";
                }
            case "Canceled":
                return "Cancelado";
            default:
                return status;
        }
    };

    const ConsultarTipoPedidoPorId = (typeOrderId) => {
        TypeOrderService.getTypeOrderById(typeOrderId).then((responsetypeorder) => {
            setTypeOrder(responsetypeorder.data);
            console.log(responsetypeorder.data);
        }).catch(error => {
            console.log(error)
        })
    }

    const carritoComprausuario = (cust_account_id, cp_user_id) => {
        ShopingCartService.getCarritoxUserIdxitemsxprecios(cust_account_id, cp_user_id).then(carrouseridresponse => {
            setcarrito(carrouseridresponse.data);
            console.log(carrouseridresponse.data);
        }).catch(error => {
            console.log(error);
        })
    }

    let sumaTotal = 0;
    let sumavolumen = 0;

    for (const elemento of carrito) {
        // Accedemos a las propiedades específicas de cada elemento
        const unitPrice = elemento[4].unit_price;
        const quantityUnits = elemento[2].cp_cart_Quantity_units;
        const quantityvolume = elemento[2].cp_cart_Quantity_volume;

        // Realizamos la multiplicación y sumamos al total
        const subtotal = unitPrice * quantityUnits;
        sumaTotal += subtotal;

        sumavolumen += quantityvolume;
    }


    const div = document.querySelector(".CuadroInfo");

    const boton = document.querySelector(".btns_perfil2 p-2 m-2 btn-sm");



    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [isOverlayVisible2, setOverlayVisible2] = useState(false);

    const toggleOverlay = () => {
        setOverlayVisible(!isOverlayVisible);
        setOverlayVisible2(false);

    };

    const ListDirecciones = (id_direccion) => {
        SoapServiceDirecciones.getAllDirecciones(id_direccion).then(response => {
            setDirecciones(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const handleDireccionSelect = (direccion) => {
        setSelectedDireccion(direccion.address1);
    };

    const ESTADOS = {
        INICIAL: {
            valor: "TODOS",
            traduccion: "Todos"
        },
        RETENIDO: {
            valor: "RETENIDO_OPEN",
            traduccion: "Retenido"
        },
        PROGRAMACION: {
            valor: "PROGRAMACION_OPEN",
            traduccion: "En programación"
        },
        CONSOLIDACION: {
            valor: "CONSOLIDACION_OPEN",
            traduccion: "En consolidación"
        },
        DESPACHADO_FACTURADO: {
            valor: "DESPACHADO_FACTURADO_CLOSED",
            traduccion: "Despachado-Facturado"
        },
        CERRADO: {
            valor: "CERRADO_CLOSED",
            traduccion: "Cerrado"
        },
        CANCELADO: {
            valor: "CANCELED",
            traduccion: "Cancelado"
        }
    };



    const toggleOverlay2 = () => {
        setOverlayVisible2(!isOverlayVisible2);
        setOverlayVisible(false);

    };

    const [orderNumber, setorderNumber] = useState([]);
    const [statusCode, setstatusCode] = useState();
    const [creationDateFrom, setcreationDateFrom] = useState([]);
    const [creationDateTo, setcreationDateTo] = useState([]);
    const [tempcreationDateTo, settempcreationDateTo] = useState();
    const [itemDescription, setitemDescription] = useState([]);

    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            alert("Por favor, complete el formulario correctamente.");
        } else {
            consultapedidobusqueda();
        }
        setValidated(true);
    }

    const consultapedidobusqueda = () => {
        orderNumber;
        const buyingPartyId = PartyId;
        const transactionTypeCode = typeOrder.cp_type_order_description;
        creationDateFrom;
        creationDateTo;
        itemDescription;
        selectedDireccion;

        if (orderNumber.length !== 0) {
            setShow2(true);
            ConsultOrderService.getOrderByOrderNumber(orderNumber, buyingPartyId).then(consultorderresponsebusqueda => {
                setorders(consultorderresponsebusqueda.data);
                setstatusCode("TODOS");
                console.log(consultorderresponsebusqueda.data);
                setShow2(false);
            }).catch(error => {
                console.log(error);
                setShow2(false);
                alert("No se encuentra el numero de pedido");
            });

        } else {
            if (creationDateFrom.length === 0) {
                alert("Por favor indicar fecha de creación desde")
            } else if (creationDateTo.length === 0) {
                alert("Por favor indicar fecha de creación hasta")
            } else if (statusCode === null) {
                alert("Por favor indicar estado")
            } else {
                setShow2(true);
                ConsultOrderService.getOrdersByCustomer(buyingPartyId, transactionTypeCode, creationDateFrom, creationDateTo).then(consultorderresponse => {
                    setorders(consultorderresponse.data);
                    settempcreationDateTo(creationDateTo);
                    setstatusCode("TODOS");
                    console.log(consultorderresponse.data);
                    setShow2(false);
                }).catch(error => {
                    console.log(error);
                    setShow2(false);
                    alert("La búsqueda no genero resultados");
                })
            }
        }
    }


    const opciones = { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const opciones2 = { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 };


    /*ESTILOS*/
    const backgroundStyleConsul = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
    };

    const StyleConsul = {
        marginTop: '5px',
        marginLeft: '2%',
        zIndex: 'auto',

    }

    const [filterValues, setFilterValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        city: '',
        state: '',
        zip: '',
    });

    const FilterStyle = {
        marginLeft: '2.5%',
        marginTop: '3%',
    }

    const BtnBuscar = {
        width: '150px',
        height: 'fit-content',
        marginRight: 'auto',
        marginLeft: 'auto',
        backgroundColor: '#941C1D',
        border: 'none',
        borderRadius: '20px',
        paddingLeft: '30px',
        paddingRight: '30px',
    }

    const info_general_items = {
        border: 'none',
        backgroundColor: '#767373', //Arreglo 8 Nov*/}
        color: 'white',
        fontSize: '12px', //Arreglo 8 Nov*/}
        fontFamily: 'Medium',
        width: 'fit-content'
    };

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    return (

        <div className='BackConsul' style={backgroundStyleConsul}>
            <BannerUser />
            {carrito.length === 0 ? (
                <div>
                    {/* Your content here */}
                </div>

            ) : (
                <div className='div_gris'>
                    <button className='Info_general_Consul' onClick={() => navigate("/CarritoCompras")} >
                        <div className='ubicar_carro_cons'>
                            <FaShoppingCart className='tamanio_carro_principal_Consul' />
                        </div>
                        <div className='Info_general_2_Consul'>
                            <table className='table-borderless' >
                                <thead >
                                </thead>
                                <tbody >
                                    <tr style={info_general_items}>
                                        <td style={info_general_items}>
                                            <tr style={info_general_items}>{sumaTotal.toLocaleString(undefined, opciones) + " " + transactional_currency_code}</tr>
                                            <tr style={info_general_items}>{carrito.length} items(s)</tr>
                                            <tr style={info_general_items}>{sumavolumen.toLocaleString(undefined, opciones2) + " "}m3 </tr>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </button>
                </div>
            )}
            <div className='FondoBlancoConsul'>
                <div className='Buttons_perfil_cons mt-12 d-flex align-items-center'>
                    <button className='btns_perfil p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/DataTablePerfilUser")}>
                        <div className='FaUser_perfil'><FaUser /></div>
                        <div className='Palabra_perfil' id='Num_perf_cons'>Perfil </div>
                        <div className='FaAngleDown_perfil '><FaAngleDown /></div>
                    </button>
                    <button className='btns_perfil p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/DataInventario")}>
                        <div className='FaSearchMinus_inv'><FaSearchMinus /> </div>
                        <div className='Palabra_inv' id='Num_Inv_cons'>Inventario disponible</div>
                        <div className='FaAngleDown_inv'><FaAngleDown /></div>
                    </button>
                    <button className='btns_perfil p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/DataPedido")}>
                        <div className='FaShoppingCart_haz'><FaShoppingCart /></div>
                        <div className='Palabra_haz' id='Num_haz_cons'>Haz tu pedido </div>
                        <div className='FaAngleDown_haz'><FaAngleDown /></div>
                    </button>
                    <button className='btns_Consul_Prin p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/ConsultaPedido")}>
                        <div className='FaTruck_const'><FaTruck /></div>
                        <div className='Palabra_cons' id='Num_cons_cons'>Consulta tu pedido</div>
                        <div className='FaAngleDown_cons'><FaAngleDown /></div>
                    </button>
                </div>

                <div className='ContenedorPadreConsul'>
                    <div className='FiltroConsul'>
                        <Form style={FilterStyle} noValidate validated={validated} onSubmit={handleSubmit}>

                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" controlId="validationCustom01">
                                    <Form.Label>Fecha de creación</Form.Label>
                                    <Form.Control
                                        type="Date"
                                        placeholder="Desde"
                                        value={creationDateFrom}
                                        onChange={(e) => setcreationDateFrom(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="validationCustom03">
                                    <Form.Label>Hasta</Form.Label>
                                    <Form.Control
                                        type="Date"
                                        placeholder="Hasta"
                                        value={creationDateTo}
                                        onChange={(e) => setcreationDateTo(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} md="3" controlId="validationCustomUsername">
                                    <Form.Label>Estado</Form.Label>
                                    <select
                                        className="form-select"
                                        value={statusCode}
                                        onChange={(e) => setstatusCode(e.target.value)}                                        >
                                        <option value="" disabled>Estado</option>
                                        {Object.values(ESTADOS).map((estado) => (
                                            <option key={estado.valor} value={estado.valor}>
                                                {estado.traduccion}
                                            </option>
                                        ))}
                                    </select>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" controlId="validationCustom02">
                                    <Form.Label>Número de pedido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="00000"
                                        value={orderNumber}
                                        onChange={(e) => setorderNumber(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} md="3" controlId="validationCustom04">
                                    <Form.Label>Dirección de envío</Form.Label>
                                    <select
                                        className="form-select"
                                        value={selectedDireccion ? selectedDireccion.siteUseId : ''}
                                        onChange={(e) => {
                                            const selectedSiteUseId = e.target.value;

                                            // Verifica si se seleccionó la opción "Selecciona una dirección"
                                            if (selectedSiteUseId === "") {
                                                setSelectedDireccion(null);  // Establece el estado a null
                                            } else {
                                                const selectedDireccion = direcciones.find((direccion) => direccion.siteUseId === selectedSiteUseId);
                                                handleDireccionSelect(selectedDireccion);
                                            }
                                        }}
                                    >
                                        <option value="">Selecciona una dirección</option>
                                        {direcciones.map((direccion) => (
                                            <option key={direccion.siteUseId} value={direccion.siteUseId}>
                                                {direccion.address1 + " - " + direccion.city}
                                            </option>
                                        ))}
                                    </select>

                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="validationCustom05">
                                    <Form.Label>Descripción de artículo</Form.Label>
                                    <Form.Control style={{ marginBottom: '20px' }}
                                        type="text"
                                        placeholder="Palabra clave"
                                        value={itemDescription}
                                        onChange={(e) => setitemDescription(e.target.value)}
                                    />
                                </Form.Group>
                                <Button style={BtnBuscar} type="submit" >Buscar</Button>
                            </Row>
                        </Form>
                    </div>

                    <div className='Tabla_info_Consul'>
                        <Table striped bordered hover >
                            <thead>
                                <tr className="text-center">
                                    <th>Pedido</th>
                                    <th>Línea</th>
                                    <th>Artículo</th>
                                    <th>Cantidad (Unidades)</th>
                                    <th>Cantidad (M3)</th>
                                    <th>Fecha Estimada de envío</th>
                                    <th>Estado</th>
                                    <th>Condición</th>
                                    <th>Fecha de despacho</th>
                                    <th>Remisión</th>
                                    <th>Factura</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.flat()
                                    .filter(order => {
                                        if (tempcreationDateTo === undefined && selectedDireccion === null && itemDescription.length === 0 && statusCode === null || statusCode === "INICIAL") {
                                            return true;
                                        }

                                        let matchesSelectedDireccion = true;
                                        let matchesItemDescription = true;
                                        let matchesStatus = true;
                                        let matchescreationDate = true;

                                        if (tempcreationDateTo !== undefined) {
                                            // Obtener la fecha sin la parte de la hora y la zona horaria de order.creationDate
                                            const formattedCreationDate = new Date(order.creationDate).toISOString().split('T')[0];

                                            matchescreationDate = order.matchescreationDate = formattedCreationDate <= tempcreationDateTo;
                                        }

                                        if (selectedDireccion !== null) {
                                            matchesSelectedDireccion = order.matchesSelectedDireccion = order.address1 === selectedDireccion;
                                        }

                                        if (itemDescription && typeof itemDescription === 'string') {
                                            matchesItemDescription = order.matchesItemDescription = order.productDescription.includes(itemDescription);
                                        }

                                        if (statusCode == "RETENIDO_OPEN") {
                                            matchesStatus = order.matchesStatus = order.onHoldFlag === true;
                                        } else if (statusCode == "PROGRAMACION_OPEN") {
                                            matchesStatus = order.matchesStatus = order.status === "Scheduled" || order.status === "Manual Scheduling Required";
                                        } else if (statusCode == "CONSOLIDACION_OPEN") {
                                            matchesStatus = order.matchesStatus = order.status === "Awaiting Shipping";
                                        } else if (statusCode == "DESPACHADO_FACTURADO_CLOSED") {
                                            matchesStatus = order.matchesStatus = order.status === "Awaiting Billing";
                                        } else if (statusCode == "CERRADO_CLOSED") {
                                            matchesStatus = order.matchesStatus = order.status === "Closed";
                                        } else if (statusCode == "CANCELED") {
                                            matchesStatus = order.matchesStatus = order.status === "Canceled";
                                        } else if (statusCode == "OPEN") {
                                            matchesStatus = order.matchesStatus = order.status === "Scheduled" || order.status === "Manual Scheduling Required" || order.status === "Awaiting Shipping";
                                        } else if (statusCode == "TODOS") {
                                            matchesStatus = order.matchesStatus = order.status === "Scheduled" || order.status === "Manual Scheduling Required" || order.status === "Awaiting Shipping" || order.status === "Awaiting Billing" || order.status === "Closed" || order.status === "Canceled";
                                        }


                                        return matchescreationDate && matchesItemDescription && matchesSelectedDireccion && matchesStatus;

                                    })
                                    .toSorted((a, b) => a.orderNumber - b.orderNumber) // Ordena el arreglo por orderNumber en orden ascendente
                                    .map((order) => {
                                        const item = items.find(item => item.inventory_item_id === order.productId);
                                        const Volumen = item ? order.orderedQuantity * item.atribute8 : 0;
                                        const formattedrequestedShipDate = order.requestedShipDate ? new Date(order.requestedShipDate).toLocaleDateString('es-CO') : '';
                                        const formattedActualShipDate = order.actualShipDate ? new Date(order.actualShipDate).toLocaleDateString('es-CO') : '';
                                        return (
                                            <tr key={order.fulfillLineId}>
                                                <td>{order.orderNumber}</td>
                                                <td className="text-center">{order.fulfillLineNumber}</td>
                                                <td>{order.productDescription}</td>
                                                <td className="text-center">{order.orderedQuantity}</td>
                                                <td className="text-center">{Volumen.toLocaleString(undefined, opciones)}</td>
                                                <td className="text-center">{formattedrequestedShipDate}</td>
                                                <td>{getStatusLabel(order.status, order.lineDetails[0]?.billingTransactionDate)}</td>
                                                <td>{order.onHoldFlag === true ? "Retenido" : "Liberado"}</td>
                                                <td className="text-center">{formattedActualShipDate}</td>
                                                <td>{order.lineDetails[1]?.billOfLadingNumber}</td>
                                                <td>{order.lineDetails[0]?.billingTransactionNumber}</td>
                                            </tr>
                                        );
                                    })}

                            </tbody>
                        </Table>
                    </div>
                </div>


                <Modal centered size="s" show={show2} onHide={handleClose2}>
                    <Modal.Header className='quitar_borde_modal_consulta' >
                    </Modal.Header>
                    <Modal.Body className='centrar_texto_consulta'>
                        <h5 className='Color_texto_consulta'><strong>Estamos procesando su solicitud...</strong></h5>
                    </Modal.Body>
                    <Modal.Footer className='quitar_borde_modal_consulta'>
                    </Modal.Footer>
                </Modal>


            </div>
            <Image className='Img_Creamos_Consul' src={imagenes.Creamos} />
        </div>

    );
};

export default ConsultaPedido;