import './ConsultaPedido.css';
import BannerUser from './BannerUsuario';
import imagenes from "../../assets/imagenes";
import { FaShoppingCart, FaUser, FaSearchMinus, FaTruck, FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import LoginService from '../../services/LoginService';
import Cookies from 'js-cookie';
import UserService from '../../services/UserService';
import { Form, Button } from 'react-bootstrap';
import SoapServiceDirecciones from '../../services/SoapServiceDirecciones';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';

const ConsultaPedido = () => {

    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCustAccountId, setUsuarioCustAccountId] = useState([]);

    const [carrito, setcarrito] = useState([]);
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

    // Traer información de disponibilidad y unirla con los artículos disponibles
    const [ArticulosConDisponibilidad, setArticulosConDisponibilidad] = useState([]);
    const ListArticulosConDisponibilidad = async (custid) => {
        try {
            const response = await ItemService.getItemsConDisponibilidad(custid);
            setArticulosConDisponibilidad(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const ListDirecciones = (id_direccion) => {
        SoapServiceDirecciones.getAllDirecciones(id_direccion).then(response => {
            setDirecciones(response.data);
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const div = document.querySelector(".CuadroInfo");

    const boton = document.querySelector(".btns_perfil2 p-2 m-2 btn-sm");



    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [isOverlayVisible2, setOverlayVisible2] = useState(false);

    const toggleOverlay = () => {
        setOverlayVisible(!isOverlayVisible);
        setOverlayVisible2(false);
        ListDirecciones(usuarioCustAccountId);
    };



    const toggleOverlay2 = () => {
        setOverlayVisible2(!isOverlayVisible2);
        setOverlayVisible(false);

    };

    const opciones = { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 };
    const opciones2 = { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 };

    const datosPrueba = [
        { id: 1, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 2, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 3, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 4, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 5, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 6, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 7, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 8, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 9, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 10, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 11, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 12, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 13, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 14, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 15, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 16, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
        { id: 17, Pedido: 'Pedido', Linea: 'Línea', Artículo: 'Artículo', Cantidad: 'Cantidad (Unidades)', CantidadM3: 'CantidadM3', FechaEsti: 'Fecha Estimada de envia', Estado: 'Estado', FechaDespa: 'Fecha Despacho', Remisión: 'Remisión', Factura: 'Factura' },
    ];



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

    const info_items_Consul = {
        border: 'none',
        backgroundColor: '#767373',
        color: 'white',
    };

    const [filterValues, setFilterValues] = useState({
        firstName: '',
        lastName: '',
        username: '',
        city: '',
        state: '',
        zip: '',
    });
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };
    const FilterStyle = {
        marginLeft: '2.5%',
        marginTop: '3%',
    }

    const BtnBuscar = {
        width: 'fit-content',
        height: 'fit-content',
        marginRight: 'auto',
        marginLeft: 'auto',
        backgroundColor: '#941C1D',
        border: 'none',
        borderRadius: '20px',
        paddingLeft: '30px',
        paddingRight: '30px',
    }





    return (
        <>
            <div className='BackConsul' style={backgroundStyleConsul}>
                <BannerUser />
                <button className='Info_general_Consul'><FaShoppingCart className='tamanio_carro_principal_Consul' onClick={() => navigate("/CarritoCompras")} />
                    <div className='Info_general_2_Consul'>
                        <table className='table-borderless' >
                            <thead >
                            </thead>
                            <tbody >
                                <tr style={info_items_Consul}>
                                    <td style={info_items_Consul}>
                                        <tr style={info_items_Consul}><strong>{sumaTotal.toLocaleString(undefined, opciones)}</strong></tr>
                                        <tr style={info_items_Consul}><strong>{carrito.length} items(s)</strong></tr>
                                        <tr style={info_items_Consul}><strong>{sumavolumen.toLocaleString(undefined, opciones2) + " "}m3 </strong></tr>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </button>
                <div className='FondoBlancoConsul'>
                    <div className='Buttons_perfil mt-12 d-flex align-items-center'>
                        <button className='btns_perfil p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/DataTablePerfilUser")}>
                            <div className='FaUser_perfil'><FaUser /></div>
                            <div className='Palabra_perfil'>Perfil </div>
                            <div className='FaAngleDown_perfil '><FaAngleDown /></div>
                        </button>
                        <button className='btns_perfil p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/DataInventario")}>
                            <div className='FaSearchMinus_inv'><FaSearchMinus /> </div>
                            <div className='Palabra_inv'>Inventario disponible</div>
                            <div className='FaAngleDown_inv'><FaAngleDown /></div>
                        </button>
                        <button className='btns_perfil p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/DataPedido")}>
                            <div className='FaShoppingCart_haz'><FaShoppingCart /></div>
                            <div className='Palabra_haz'>Haz tu pedido </div>
                            <div className='FaAngleDown_haz'><FaAngleDown /></div>
                        </button>
                        <button className='btns_perfil p-2 m-2 btn-sm d-flex align-items-center' onClick={() => navigate("/ConsultaPedido")}>
                            <div className='FaTruck_cons'><FaTruck /></div>
                            <div className='Palabra_cons'>Consulta tu pedido</div>
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
                                            required
                                            type="Date"
                                            placeholder="Desde"
                                            value={filterValues.fechaCrea}
                                            onChange={(e) => setFilterValues({ ...filterValues, fechaCrea: e.target.value })}
                                            isInvalid={validated && !filterValues.fechaCrea}

                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom02">
                                        <Form.Label>Número de pedido</Form.Label>
                                        <Form.Control

                                            type="text"
                                            placeholder="00000"

                                            value={filterValues.NumPed}
                                            onChange={(e) => setFilterValues({ ...filterValues, NumPed: e.target.value })}
                                            isInvalid={validated && !filterValues.NumPed}
                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustomUsername">
                                        <Form.Label>Estado</Form.Label>
                                        <InputGroup hasValidation>

                                            <Form.Control
                                                type="text"
                                                placeholder="Username"
                                                aria-describedby="inputGroupPrepend"

                                                value={filterValues.Estado}
                                                onChange={(e) => setFilterValues({ ...filterValues, Estado: e.target.value })}
                                                isInvalid={validated && !filterValues.Estado}
                                            />

                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="4" controlId="validationCustom03">

                                        <Form.Control
                                            type="Date"
                                            placeholder="Hasta"
                                            required
                                            value={filterValues.firstName}
                                            onChange={(e) => setFilterValues({ ...filterValues, firstName: e.target.value })}
                                            isInvalid={validated && !filterValues.firstName}
                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom04">
                                        <Form.Label>Dirección de envío</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="State"

                                            value={filterValues.firstName}
                                            onChange={(e) => setFilterValues({ ...filterValues, firstName: e.target.value })}
                                            isInvalid={validated && !filterValues.firstName}
                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="3" controlId="validationCustom05">
                                        <Form.Label>Descripción de artículo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Palabra clave"

                                            value={filterValues.firstName}
                                            onChange={(e) => setFilterValues({ ...filterValues, firstName: e.target.value })}
                                            isInvalid={validated && !filterValues.firstName}
                                        />

                                    </Form.Group>
                                    <Button style={BtnBuscar} type="submit">Buscar</Button>
                                </Row>

                            </Form>
                        </div>

                        <div className='Tabla_info_Consul'>
                            <Table striped bordered hover >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Pedido</th>
                                        <th>Línea</th>
                                        <th>Artículo</th>
                                        <th>Cantidad (Unidades)</th>
                                        <th>Cantidad (M3)</th>
                                        <th>Fecha Estimada de envío</th>
                                        <th>Estado</th>
                                        <th>Fecha de despacho</th>
                                        <th>Remisión</th>
                                        <th>Factura</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {datosPrueba.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.Pedido}</td>
                                            <td>{item.Linea}</td>
                                            <td>{item.Artículo}</td>
                                            <td>{item.Cantidad}</td>
                                            <td>{item.CantidadM3}</td>
                                            <td>{item.FechaEsti}</td>
                                            <td>{item.Estado}</td>
                                            <td>{item.FechaDespa}</td>
                                            <td>{item.Remisión}</td>
                                            <td>{item.Factura}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                        </div>

                    </div>


                </div>
                <Image className='Img_Creamos_Consul' src={imagenes.Creamos} />
            </div>
        </>
    );
};

export default ConsultaPedido;