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
import ShopingCartService from '../../services/ShopingCartService';
import ShopingCartLineService from '../../services/ShopingCartLineService';
import AvailabilityService from '../../services/AvailabilityService';
import PromesasServices from '../../services/PromesasServices';

const CarritoCompras = () => {

    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuarioTelefono, setUsuarioTelefono] = useState([]);
    const [usuarioEmpresa, setUsuarioEmpresa] = useState([]);
    const [PartyId, setPartyId] = useState([]);
    const [usuarioId, setUsarioId] = useState([]);
    const [CustAccountId, setCustAccountId] = useState([]);
    const [carrito, setcarrito] = useState([]);
    const [itempromesa, setItempromesa] = useState([]);
    const [account_id, setaccount_id] = useState([]);
    const [transactional_currency_code, settransactional_currency_code] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        SesionUsername();
        listarpromesas();
    }, [])

    const SesionUsername = () => {
        if (LoginService.isAuthenticated()) {
            const read = Cookies.get()
            //console.log(read)
            //alert("Bienvenido " + read.portal_sesion);    
            UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
                console.log(responseid.data)
                setUarioSesion(responseid.data.cp_name);
                setUsuarioCorreo(responseid.data.username);
                setCustAccountId(responseid.data.cust_account_id);
                setUsarioId(responseid.data.cp_user_id);
                setUsuarioTelefono(responseid.data.cp_cell_phone);
                setUsuarioEmpresa(responseid.data.cust_name);
                setPartyId(responseid.data.party_id);
                setaccount_id(responseid.data.party_id)
                settransactional_currency_code(responseid.data.transactional_currency_code);

                carritoComprausuario(responseid.data.cust_account_id, responseid.data.cp_user_id);

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

    const carritoComprausuario = (cust_account_id, cp_user_id) => {
        ShopingCartService.getCarritoxUserIdxitemsxprecios(cust_account_id, cp_user_id).then(carrouseridresponse => {
            setcarrito(carrouseridresponse.data);
            console.log(carrouseridresponse.data);
            if (carrouseridresponse.data.length === 0) {
                setShow2(true);
            }
        }).catch(error => {
            console.log(error);
            setShow2(true);
        })
    }

    const listarpromesas = () => {
        PromesasServices.getAllpromises().then(promesasresponde => {
            setItempromesa(promesasresponde.data);
            console.log(promesasresponde.data);

        })
    }

    const calculateEntrega = (carritoItem) => {
        if (carritoItem[5] === null) {
            const promesaFiltrada = itempromesa.find(promesa => promesa.cp_type_promise === "Sin disponibilidad");
            return promesaFiltrada.cp_description_promise;
        } else if (carritoItem[2].cp_cart_Quantity_units > carritoItem[5].available_to_transact) {
            const promesaFiltrada = itempromesa.find(promesa => promesa.cp_type_promise === "Sin disponibilidad");
            return promesaFiltrada.cp_description_promise;
        } else {
            const promesaFiltrada = itempromesa.find(promesa => promesa.cp_type_promise === "Disponibilidad");
            return promesaFiltrada.cp_description_promise;
        }
    };

    const calcularFechaEntrega = (diasLaborales) => {
        const fechaHoy = new Date(); // Fecha actual
        let fechaEntrega = new Date(fechaHoy);

        while (diasLaborales > 0) {
            fechaEntrega.setDate(fechaEntrega.getDate() + 1); // Sumamos un día

            // Si el día de la semana no es sábado (6) ni domingo (0), descontamos un día laboral
            if (fechaEntrega.getDay() !== 0 && fechaEntrega.getDay() !== 6) {
                diasLaborales--;
            }
        }

        const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return fechaEntrega.toLocaleDateString(undefined, opcionesFecha);
    };

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


    // Define un estado para los contadores de cada artículo
    const [contadores, setContadores] = useState({});

    const incrementarContador = (inventory_item_id, atribute9, Quantity_units, CardlineId, atribute8) => {
        setContadores(prevContadores => {
            const nuevoContador = { ...prevContadores };
            nuevoContador[inventory_item_id] = (nuevoContador[inventory_item_id] || Quantity_units) + atribute9;

            const cp_cart_Quantity_units = (Quantity_units + atribute9);
            const cp_cart_Quantity_packages = Math.floor((Quantity_units + atribute9) / atribute9);
            const cp_cart_Quantity_volume = (Quantity_units + atribute9) * atribute8;
            const Cardline = { cp_cart_Quantity_units, cp_cart_Quantity_packages, cp_cart_Quantity_volume };
            ActualizarLinea(CardlineId, Cardline);

            return nuevoContador;
        });
    };

    const decrementarContador = (inventory_item_id, atribute9, Quantity_units, CardlineId, atribute8) => {
        setContadores(prevContadores => {
            const nuevoContador = { ...prevContadores };
            if (nuevoContador[inventory_item_id] > Quantity_units) {
                nuevoContador[inventory_item_id] -= atribute9;
            }

            if (Quantity_units - atribute9 == 0) {
                alert("No se puede disminuir a 0 Unidades");
            } else {
                const cp_cart_Quantity_units = (Quantity_units - atribute9);
                const cp_cart_Quantity_packages = Math.floor((Quantity_units - atribute9) / atribute9);
                const cp_cart_Quantity_volume = (Quantity_units - atribute9) * atribute8;
                const Cardline = { cp_cart_Quantity_units, cp_cart_Quantity_packages, cp_cart_Quantity_volume };
                ActualizarLinea(CardlineId, Cardline);
            }
            return nuevoContador;
        });
    };



    const ActualizarLinea = (CardlineId, Cardline) => {
        ShopingCartLineService.updateCarline(CardlineId, Cardline).then(Actualizalinearesponse => {
            console.log(Actualizalinearesponse.data);
            window.location.reload();
        }).catch(error => {
            console.log(error);
            alert("Error al actualizar cantidad")
        })
    }


    //Eliminar linea de carrito 
    const deleteCarritoLine = (CarLineId) => {
        ShopingCartLineService.deleteCarline(CarLineId).then(deleteresponse => {
            console.log(deleteresponse.data);
            alert("Articulo eliminado")
            window.location.reload();
        }).catch(error => {
            console.log(error);
            alert("Error al eliminar linea de carrito")
        })

    }


    //eliminar carrito 

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
                    setShow2(true);
                });
        }


    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => {
        setShow2(false);
        window.location.reload();
    }
    const handleShow2 = () => {
        deleteCarrito();
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

    const style_precio_unit = {
        border: 'none',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center'
    };

    const info_general_items = {
        border: 'none',
        backgroundColor: '#767373',
        color: 'white',
    };

    const opciones = { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 };
    const opciones2 = { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 };


    return (
        <>
            <div className='Back' style={backgroundStyle}>
                <BannerUser />
                <button className='Info_general'><FaShoppingCart className='tamanio_carro_principal' onClick={() => navigate("/CarritoCompras")} />
                    <div className='Info_general_2'>

                        <table className='table-borderless' >
                            <thead >

                            </thead>
                            <tbody >
                                <tr style={info_general_items}>
                                    <td style={info_general_items}>
                                        <tr style={info_general_items}><strong>{sumaTotal.toLocaleString(undefined, opciones) + " " + transactional_currency_code}</strong></tr>
                                        <tr style={info_general_items}><strong>{carrito.length} items(s)</strong></tr>
                                        <tr style={info_general_items}><strong>{sumavolumen.toLocaleString(undefined, opciones2) + " "}m3 </strong></tr>
                                    </td>
                                </tr>


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
                                <tr>{usuarioEmpresa}</tr>
                                <tr>{usuarioCorreo}</tr>
                                <tr>{usuarioTelefono}</tr>
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
                                    {carrito
                                        .map((carrito) => (
                                            <tr key={carrito[3].inventory_item_id}>
                                                <td style={bannerStyle_carrito2}>
                                                    <div className='ancho_div'>
                                                        <div className='alinea_imagen'>
                                                            <td key={carrito[2].cp_cart_line_id}> <img className='Borde_imagenes_carrito'
                                                                src={`/public/articulos/${carrito[3].item_number}.jpg`}
                                                                style={{ width: '180px', height: '190px' }}
                                                            />
                                                            </td>
                                                        </div>
                                                        <td >
                                                            <div className='Organiza_descripción'>
                                                                <tr style={cellStyle}><strong>{carrito[3].item_description_long}</strong></tr>
                                                            </div>
                                                            <div className='Organiza_articulo'>
                                                                <tr style={cellStyle}>CODIGO ARTICULO: {carrito[3].item_number}</tr>
                                                            </div>
                                                            <div className='Organiza_entrega'>
                                                                <div><FaTruck className='tamaño-camion' /></div>
                                                                <div className='Organiza_entrega_2'>
                                                                    <tr style={cellStyle2}><strong>ENTREGA EN  {calculateEntrega(carrito) + " DIAS"}</strong></tr>
                                                                    <tr style={cellStyle2}>Fecha de entrega: {calcularFechaEntrega(calculateEntrega(carrito))} </tr>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </div>
                                                </td>

                                                <td style={bannerStyle_carrito2}>
                                                    <div style={bannerStyle_carrito} className='precio_unit'>
                                                        <tr style={style_precio_unit}>

                                                            <td >  ${(carrito[4].unit_price).toLocaleString(undefined, opciones) + " " + carrito[4].currency_code}
                                                            </td>

                                                        </tr>
                                                    </div>
                                                </td>

                                                <td style={bannerStyle_carrito2}>
                                                    <div className='principal_contador_carrito'>
                                                        <td>
                                                            <div className="contador-box-carrito">
                                                                {contadores[carrito[2].inventory_item_id] || carrito[2].cp_cart_Quantity_units}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <Col><Button className='decre_incre_carrito' onClick={() => incrementarContador(carrito[3].inventory_item_id, carrito[3].atribute9, carrito[2].cp_cart_Quantity_units, carrito[2].cp_cart_line_id, carrito[3].atribute8)}>+</Button></Col>
                                                                <Col><Button className='decre_incre_carrito2' onClick={() => decrementarContador(carrito[3].inventory_item_id, carrito[3].atribute9, carrito[2].cp_cart_Quantity_units, carrito[2].cp_cart_line_id, carrito[3].atribute8)}>-</Button></Col>
                                                            </div>
                                                        </td>
                                                    </div>
                                                </td>

                                                <td style={bannerStyle_carrito2}><div className='metro_cubico'>{carrito[2].cp_cart_Quantity_volume} </div></td>
                                                <td style={bannerStyle_carrito2}>
                                                    <div style={bannerStyle_carrito} className='precio_tot'>

                                                        <tr style={style_precio_unit}>
                                                            <td> ${(carrito[4].unit_price * carrito[2].cp_cart_Quantity_units).toLocaleString(undefined, opciones) + " " + carrito[4].currency_code}</td>
                                                        </tr>

                                                    </div>
                                                </td>
                                                <td style={bannerStyle_carrito2}>
                                                    <Button className='btn_eliminar'>
                                                        <FaTrashAlt onClick={() => deleteCarritoLine(carrito[2].cp_cart_line_id)} />
                                                    </Button>

                                                </td>

                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div >
                            <Button className='btns_carrito_seguir' onClick={() => navigate("/DataInventario")}>Seguir comprando   </Button>
                            {carrito.length !== 0 && (
                                <>
                                    <Button onClick={handleShow} className='btns_carrito_borrar'>Borrar carrito</Button>
                                    <Button onClick={() => navigate("/FinalizarCompra")} className='btns_carrito_finalizar'>Finalizar compra</Button>
                                </>
                            )}
                        </div>

                        <Modal show={show} onHide={handleClose} centered >
                            <Modal.Body className='modal_principal_carrito' >
                                <div className='modal-frase-carrito'>
                                    <h6><strong>¿Está seguro de que deseas vaciar tu carrito?</strong></h6>
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
                                    <Button className='btns_carrito_sigue' onClick={() => navigate("/DataInventario")}>Sigue Comprando</Button>
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