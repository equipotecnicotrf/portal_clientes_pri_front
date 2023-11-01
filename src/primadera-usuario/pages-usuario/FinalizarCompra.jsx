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
import SoapServiceDirecciones from '../../services/SoapServiceDirecciones';
import ShopingCartService from '../../services/ShopingCartService';
import PedidoService from '../../services/PedidoService';
import ConsecutiveService from '../../services/ConsecutiveService';
import IvaService from '../../services/IVAService';
import ShopingCartLineService from '../../services/ShopingCartLineService';
import TypeOrderService from '../../services/TypeOrderService';
import NotificationService from '../../services/NotificationService';
import EmailService from '../../services/EmailService';

const FinalizarCompra = () => {

    //validacion de sesion activa

    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuarioTelefono, setUsuarioTelefono] = useState([]);
    const [usuarioEmpresa, setUsuarioEmpresa] = useState([]);
    const [PartyId, setPartyId] = useState([]);
    const [usuarioId, setUsarioId] = useState([]);
    const [CustAccountId, setCustAccountId] = useState([]);
    const [payment_terms, setpayment_terms] = useState([]);
    const [transactional_currency_code, settransactional_currency_code] = useState([]);
    const [cp_type_order_id, setcp_type_order_id] = useState('');
    const [siteUseIdpedido, setsiteUseIdpedido] = useState([]);
    const [nameVendedor, setnameVendedor] = useState([]);
    const [partySiteId, setpartySiteId] = useState([]);



    const [carrito, setcarrito] = useState([]);
    const [direcciones, setDirecciones] = useState([]);


    const navigate = useNavigate();
    useEffect(() => {
        SesionUsername();
        ListarIva();
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
                setpayment_terms(responseid.data.payment_terms);
                settransactional_currency_code(responseid.data.transactional_currency_code);
                setcp_type_order_id(responseid.data.cp_type_order_id);

                ListDirecciones(responseid.data.cust_account_id);
                carritoCompra(responseid.data.cust_account_id, responseid.data.cp_user_id);
                ConsultarTipoPedidoPorId(responseid.data.cp_type_order_id)

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


    const [porcIva, setPorcIva] = useState([]);
    const ListarIva = () => {
        IvaService.getAllIva()
            .then(response => {
                setPorcIva(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const fechaHoy = new Date(); // Obtén la fecha actual
    const ivaFiltrados = porcIva.filter(porcIva => {
        const fechaInicio = new Date(porcIva.cp_IVA_date_start);
        const fechaFin = new Date(porcIva.cp_IVA_date_end);

        return fechaHoy >= fechaInicio && fechaHoy <= fechaFin;
    });

    console.log("ivaFiltrados:", ivaFiltrados[0]);

    const carritoCompra = (cust_account_id, cp_user_id) => {
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


    //Eliminar carrito

    const deleteCarrito = () => {
        if (carrito && carrito.length > 0) {
            // Recorremos las líneas del carrito y las eliminamos una por una
            Promise.all(
                carrito.map((carritoItem) => {
                    // Eliminar la línea del carrito actual
                    ShopingCartService.deleteCar(carritoItem[1].cp_cart_id).then(deleteCarresponse => {
                        console.log(deleteCarresponse.data);
                    }).catch(error => {
                        console.log(error);
                    })
                    return ShopingCartLineService.deleteCarline(carritoItem[2].cp_cart_line_id);
                }))
                .then((deletelineresponse) => {
                    // Todas las líneas se eliminaron con éxito
                    console.log(deletelineresponse.data)
                })
                .catch((error) => {
                    console.log("Error al eliminar una o más líneas del carrito", error);
                });
        }


    }

    const ListDirecciones = (id_direccion) => {
        SoapServiceDirecciones.getAllDirecciones(id_direccion).then(response => {
            setDirecciones(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDirecciones, setFilteredDirecciones] = useState([]);

    const handleDireccionSelect = (direccion) => {
        setSelectedDireccion(direccion);
        setSearchTerm('');
        setnameVendedor(direccion.nameVendedor);
        setpartySiteId(direccion.partySiteId);

    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const filtered = direcciones.filter((direccion) =>
            direccion.address1.toLowerCase().includes(searchTerm) && direccion.siteUseCode === 'SHIP_TO'
        );
        setFilteredDirecciones(filtered);
    };


    const [selectedDireccionBillto, setSelectedDireccionBillto] = useState(null);
    const [searchTermBillto, setSearchTermBillto] = useState('');
    const [filteredDireccionesBillto, setFilteredDireccionesBillto] = useState([]);


    const handleDireccionSelectBillto = (direccionbillto) => {
        setSelectedDireccionBillto(direccionbillto);
        setSearchTermBillto('');
        setsiteUseIdpedido(direccionbillto.siteUseId);
    };

    const handleSearchChangeBillto = (e) => {
        const searchTermBillto = e.target.value.toLowerCase();
        setSearchTermBillto(searchTermBillto);

        const filteredBillto = direcciones.filter((direccionbillto) =>
            direccionbillto.address1.toLowerCase().includes(searchTerm) && direccionbillto.siteUseCode === 'BILL_TO'
        );
        setFilteredDireccionesBillto(filteredBillto);
    };

    const [crearpedidoERP, setCrearpedidoERP] = useState([]);
    const [ordenCompra, setordenCompra] = useState([]);

    const lineItemsPedido = carrito.map((carritoItem) => ({
        productNumber: carritoItem[3].item_number,
        orderedQuantity: carritoItem[2].cp_cart_Quantity_units,
        orderedUom: carritoItem[3].unit_of_measure
    }));


    //listar consecutivos
    const [consecutivo, Setconsecutivo] = useState([]);
    useEffect(() => {
        ListarConsecutivo()
    }, [])

    const ListarConsecutivo = () => {
        ConsecutiveService.getAllConsecutives().then(response => {
            Setconsecutivo(response.data)
            console.log(response.data)
        }).catch(error => {
            console.log(error);
        })
    }


    const [cp_type_order_meaning, setcp_Type_Order_Meaning] = useState('');

    //consulta por ID
    const ConsultarTipoPedidoPorId = (typeOrderId) => {
        TypeOrderService.getTypeOrderById(typeOrderId).then((response) => {
            setcp_Type_Order_Meaning(response.data.cp_type_order_meaning);
        }).catch(error => {
            console.log(error)
        })
    }



    //creacion pedido


    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            alert("Por favor, complete el formulario correctamente.");
        } else {
            pedidoERP();
        }

        setValidated(true);
    }




    const pedidoERP = () => {
        if (selectedDireccionBillto === null || selectedDireccion === null) {
            alert("Por favor, seleccione dirección de envío y de facturación.");
        } else {
            const fechaHoy = new Date(); // Obtén la fecha actual

            const consecutivosFiltrados = consecutivo.filter(consecutivo => {
                const fechaInicio = new Date(consecutivo.cp_Consecutive_date_start);
                const fechaFin = new Date(consecutivo.cp_Consecutive_date_end);

                return fechaHoy >= fechaInicio && fechaHoy <= fechaFin;
            })


            const enviopedido = {
                consecutive: consecutivosFiltrados[0].cp_Consecutive_code + consecutivosFiltrados[0].cp_Consecutive_num,
                buyingPartyName: usuarioEmpresa,
                transactionType: cp_type_order_meaning,
                paymentTerms: payment_terms,
                transactionalCurrencyCode: transactional_currency_code,
                salesperson: nameVendedor,
                customerPONumber: ordenCompra,
                customerAccountId: CustAccountId,
                siteUseId: parseInt(siteUseIdpedido),
                partyId: PartyId,
                siteId: parseInt(partySiteId),
                lineItems: lineItemsPedido
            }

            console.log("enviopedido:", enviopedido);

            PedidoService.Insertarpedido(enviopedido).then(responsepedidoERP => {
                setCrearpedidoERP(responsepedidoERP.data.substring(41, 1000));
                //console.log(responsepedidoERP.data)

                //Actualizar Consecutivo
                const cp_Consecutive_code = consecutivosFiltrados[0].cp_Consecutive_code;
                const cp_Consecutive_num = consecutivosFiltrados[0].cp_Consecutive_num + 1;
                const cp_Consecutive_date_start = consecutivosFiltrados[0].cp_Consecutive_date_start;
                const cp_Consecutive_date_end = consecutivosFiltrados[0].cp_Consecutive_date_end;
                const cp_Consecutive_id = consecutivosFiltrados[0].cp_Consecutive_id;
                const consecutive_edit = { cp_Consecutive_code, cp_Consecutive_num, cp_Consecutive_date_start, cp_Consecutive_date_end };

                ConsecutiveService.updateConsecutive(cp_Consecutive_id, consecutive_edit).then((responseConsecutive) => {
                    console.log(responseConsecutive.data);
                    //alert(responsepedidoERP.data)   

                    const context = "Creacion Pedido";
                    NotificationService.getNotificationsContext(context).then((notificatioresponse) => {
                        console.log(notificatioresponse.data)
                        const toUser = [usuarioCorreo];
                        const subject = notificatioresponse.data[0].cp_Notification_name
                            .replace('${pedidooracle}', responsepedidoERP.data.substring(41, 1000))
                        const notificationMessage = notificatioresponse.data[0].cp_Notification_message;
                        const message = notificationMessage
                            .replace('${fechapedido}', fechaHoy)
                            .replace('${nombreusuario}', usuarioSesion)
                            .replace('${pedidooracle}', responsepedidoERP.data.substring(41, 1000))
                            .replace('${pedidooraclecuerpo}', responsepedidoERP.data.substring(41, 1000))
                        const correo = { toUser, subject, message };
                        EmailService.Sendmessage(correo).then(() => {
                            setShow(true);
                            deleteCarrito();
                        }).catch(error => {
                            console.log(error);
                            alert("Error al enviar correo");
                        })

                    }).catch(error => {
                        console.log(error);
                        alert("Error obtener contexto de notificacion");
                    })

                }).catch((error) => {
                    console.log(error);
                    alert("Error al actualizar Consecutivo")
                });
            }).catch(error => {
                console.log(error);
                alert("Error al Crear pedido en el ERP")
            })
        }
    }



    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        navigate("/CarritoCompras")
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


    const opciones = { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 };
    const opciones2 = { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 };

    return (

        <div className='Back' style={backgroundStyle}>
            <BannerUser />

            <button className='Info_general_compra'><FaShoppingCart className='tamano_carro_principal_compra' onClick={() => navigate("/CarritoCompras")} />
                <div className='Info_general_compra_2'>
                    <table className='table-borderless' >
                        <thead >
                        </thead>
                        <tbody >
                            <tr style={info_general_items}>
                                <td style={info_general_items}>
                                    <tr style={info_general_items}><strong>{sumaTotal.toLocaleString(undefined, opciones)}</strong></tr>
                                    <tr style={info_general_items}><strong>{carrito.length} items(s)</strong></tr>
                                    <tr style={info_general_items}><strong>{sumavolumen.toLocaleString(undefined, opciones2) + " "}m3 </strong></tr>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </button>

            <div className='FondoBlanco_compra'>

                <div className='Buttons_compra mt-12'>
                    <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataTablePerfilUser")}><FaUser /> Perfil</button>
                    <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataInventario")}><FaSearchMinus /> Inventario Disponible</button>
                    <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataPedido")}><FaShoppingCart /> Haz tu pedido</button>
                    <button className='btns_inventario p-2 m-2 btn-sm'><FaTruck /> Consulta tu pedido</button>
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
                            <tr>{usuarioEmpresa}</tr>
                            <tr>{usuarioCorreo}</tr>
                            <tr>{usuarioTelefono}</tr>
                        </td>
                    </tr>
                </div>

                <Form noValidate validated={validated} onSubmit={handleSubmit} >
                    <div className='ContenedorPadre_compra'>
                        <div className='direccion_envio'>
                            <div className='direccion_busca'>
                                <FaTruck className='tamano_carro_compra_2' /><h5 className='tamano_direccion'> <strong>DIRECCION DE ENVIO</strong></h5>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                    <Dropdown>
                                        <Dropdown.Toggle className="buscador mb-3" style={{ color: 'black' }} controlId="exampleForm.ControlInput4" id="dropdown-basic">
                                            {selectedDireccion ? selectedDireccion.address1 : 'Escoge tu dirección'}
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
                                                    key={direccion.siteUseId}
                                                    onClick={() => handleDireccionSelect(direccion)} >
                                                    {direccion.address1 + " - " + direccion.city}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </div>
                            <div className='direccion_busca'>
                                <FaTruck className='tamano_carro_compra_2' /><h5 className='tamano_direccion'> <strong>DIRECCION DE FACTURACION</strong></h5>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                    <Dropdown>
                                        <Dropdown.Toggle className="buscador mb-3" style={{ color: 'black' }} controlId="exampleForm.ControlInput4" id="dropdown-basic">
                                            {selectedDireccionBillto ? selectedDireccionBillto.address1 : 'Escoge tu dirección'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Form.Control
                                                type="text"
                                                placeholder="Buscar dirección"
                                                value={searchTermBillto}
                                                onChange={handleSearchChangeBillto}
                                            />
                                            {filteredDireccionesBillto.map((direccionbillto) => (
                                                <Dropdown.Item
                                                    key={direccionbillto.siteUseId}
                                                    onClick={() => handleDireccionSelectBillto(direccionbillto)} >
                                                    {direccionbillto.address1 + " - " + direccionbillto.city}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </div>
                            <div className='orden_compra'>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                                    <Form.Label ><strong>Orden de Compra</strong></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Orden de Compra"
                                        autoFocus
                                        value={ordenCompra}
                                        onChange={(e) => setordenCompra(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Por favor ingresa orden de compra</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                                </Form.Group>
                            </div>
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
                                        {carrito
                                            .map((carrito) => (
                                                <tr key={carrito[3].inventory_item_id}>
                                                    <td style={Style_tables}>< FaStar /></td>
                                                    <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>
                                                        <tr style={Style_tables}>{carrito[3].item_description_long}</tr>
                                                        <tr style={Style_tables} >CANTIDADES: {carrito[2].cp_cart_Quantity_units}</tr>
                                                    </td>
                                                    <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>${(carrito[4].unit_price * carrito[2].cp_cart_Quantity_units).toLocaleString(undefined, opciones) + " " + carrito[4].currency_code}
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
                                        <React.Fragment>
                                            <tr className="borde_horizontal" >
                                            </tr>
                                            <tr >
                                                <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>Subtotal</td>
                                                <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>{sumaTotal.toLocaleString(undefined, opciones)}</td>
                                            </tr>
                                            <tr className="borde_horizontal">
                                                <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>IVA</td>
                                                <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>{(sumaTotal * ((ivaFiltrados.length > 0 ? ivaFiltrados[0].cp_IVA : 0) / 100)).toLocaleString(undefined, opciones)}</td>
                                            </tr>
                                            <tr >
                                                <td style={{ textAlign: 'left', backgroundColor: '#D9D9D9' }}>Total</td>
                                                <td style={{ textAlign: 'right', backgroundColor: '#D9D9D9' }}>{(sumaTotal + (sumaTotal * ((ivaFiltrados.length > 0 ? ivaFiltrados[0].cp_IVA : 0) / 100))).toLocaleString(undefined, opciones)}</td>
                                            </tr>
                                        </React.Fragment>
                                    </tbody>
                                </table>
                            </div>
                            <div className='centrar_boton_confirmar'>
                                <Button type='submit' className='btns_carrito_conf_compra' >Confirmar orden   </Button>
                            </div>
                        </div>



                        <Modal show={show} onHide={handleClose} centered className='ancho_modal_finalizar' >
                            <Modal.Header closeButton></Modal.Header>
                            <Modal.Body className='modal_principal_finalizar' >
                                <div className='modal-frase-finalizar'>
                                    <FaTruck className='centrar_carrito_finalizar' />
                                    <h5><strong>Su ORDEN # {crearpedidoERP} </strong></h5>
                                    <h5><strong> HA SIDO CREADA</strong></h5>
                                    <h5><strong>_______________________</strong></h5>
                                    <p><strong>Su pedido será confirmado después de las validaciones de cupo y cartera por medio de un correo electrónico.</strong></p>
                                </div>
                            </Modal.Body>
                            <Modal.Footer ></Modal.Footer>
                        </Modal>
                    </div>
                </Form>

            </div >

            <Image className='Img-Creamos_carrito' src={imagenes.Creamos} />
        </div >

    );
};

export default FinalizarCompra;