import BannerUser from './BannerUsuario';
import './InventarioUser.css';
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
import ItemService from '../../services/ItemService';
import Button from 'react-bootstrap/Button';
import { FaShoppingCart, FaUser, FaSearchMinus, FaTruck, FaSearch } from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import ShopingCartService from '../../services/ShopingCartService';
import OrderService from '../../services/OrderService';
import ShopingCartLineService from '../../services/ShopingCartLineService';
import OrderLineService from '../../services/OrderLineService';
import IvaService from '../../services/IVAService';

const DataInventario = () => {
    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuarioTelefono, setUsuarioTelefono] = useState([]);
    const [usuarioEmpresa, setUsuarioEmpresa] = useState([]);
    const [usuarioId, setUsarioId] = useState([]);
    const [CustAccountId, setCustAccountId] = useState([]);
    const [PartyId, setPartyId] = useState([]);
    const [carrito, setcarrito] = useState([]);
    const [transactional_currency_code, settransactional_currency_code] = useState([]);
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
                settransactional_currency_code(responseid.data.transactional_currency_code);

                carritoComprausuario(responseid.data.cust_account_id, responseid.data.cp_user_id);
                ListArticulosConDisponibilidad(responseid.data.party_id);

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

    //listar iva
    useEffect(() => {
        ListarIva();
    }, [])

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



    //Crear Carrito de Compra
    const [carritocrear, setcarritocrear] = useState([]);
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
                setcarritocrear(carrouseridresponse.data);
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
                    const cart_id = carritocrear[0].cp_cart_id;
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





    const [articulos, setArticulos] = useState([]);
    const [acabado, setAcabado] = useState([]);
    const [caras, setCaras] = useState([]);
    const [diseno, setDiseno] = useState([]);
    const [sustrato, setSustrato] = useState([]);
    const [espesor, setEspesor] = useState([]);
    const [formato, setFormato] = useState([]);
    const [searchText, setSearchText] = useState(''); // Nuevo estado para el texto de búsqueda

    useEffect(() => {
        ListArticulos();
        ListAcabado();
        ListCaras();
        ListDiseno();
        ListSustrato();
        ListEspesor();
        ListFormato();
    }, []);

    const ListArticulos = () => {
        ItemService.getItemsLinea()
            .then(response => {
                setArticulos(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListAcabado = () => {
        ItemService.getItemsAcabado()
            .then(response => {
                setAcabado(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListCaras = () => {
        ItemService.getItemsCaras()
            .then(response => {
                setCaras(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListDiseno = () => {
        ItemService.getItemsDiseno()
            .then(response => {
                setDiseno(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListSustrato = () => {
        ItemService.getItemsSustrato()
            .then(response => {
                setSustrato(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListEspesor = () => {
        ItemService.getItemsEspesor()
            .then(response => {
                setEspesor(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListFormato = () => {
        ItemService.getItemsFormato()
            .then(response => {
                setFormato(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Función para filtrar diseño según el texto de búsqueda
    const filterDiseño = () => {
        return diseno.filter((disenoitems) => {
            const diseñoText = `${disenoitems}`;
            return diseñoText.toLowerCase().includes(searchText.toLowerCase());
        });
    };





    const products = [
        { id: 1, name: 'Linea', category: 'Linea' },
        { id: 2, name: 'Acabados', category: 'Acabados' },
        { id: 3, name: 'Caras', category: 'Caras' },
        { id: 4, name: 'Diseños', category: 'Diseños' },
        { id: 5, name: 'Sustrato', category: 'Sustrato' },
        { id: 6, name: 'Espesor', category: 'Espesor' },
        { id: 7, name: 'Formato', category: 'Formato' },
        // ...
    ];

    const categories = ['Linea', 'Acabados', 'Caras', 'Diseños', 'Sustrato', 'Espesor', 'Formato'];

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [expandedSections, setExpandedSections] = useState([]);

    const handleSectionToggle = (category) => {
        setExpandedSections((prevSections) => {
            if (prevSections.includes(category)) {
                return prevSections.filter((section) => section !== category);
            } else {
                return [...prevSections, category];
            }
        });
    };

    const [selectedLinea, setSelectedLinea] = useState(new Set());
    const [selectedAcabados, setSelectedAcabados] = useState(new Set());
    const [selectedCaras, setSelectedCaras] = useState(new Set());
    const [selectedDiseños, setSelectedDiseños] = useState(new Set());
    const [selectedSustrato, setSelectedSustrato] = useState(new Set());
    const [selectedEspesor, setSelectedEspesor] = useState(new Set());
    const [selectedFormato, setSelectedFormato] = useState(new Set());

    const handleOptionSelect = (category, value) => {
        switch (category) {
            case 'Linea':
                setSelectedLinea((prevSelected) => {
                    const updatedSelected = new Set(prevSelected);
                    if (prevSelected.has(value)) {
                        updatedSelected.delete(value);
                    } else {
                        updatedSelected.add(value);
                    }
                    return updatedSelected;
                });
                break;
            case 'Acabados':
                setSelectedAcabados((prevSelected) => {
                    const updatedSelected = new Set(prevSelected);
                    if (prevSelected.has(value)) {
                        updatedSelected.delete(value);
                    } else {
                        updatedSelected.add(value);
                    }
                    return updatedSelected;
                });
                break;
            case 'Caras':
                setSelectedCaras((prevSelected) => {
                    const updatedSelected = new Set(prevSelected);
                    if (prevSelected.has(value)) {
                        updatedSelected.delete(value);
                    } else {
                        updatedSelected.add(value);
                    }
                    return updatedSelected;
                });
                break;
            case 'Diseños':
                setSelectedDiseños((prevSelected) => {
                    const updatedSelected = new Set(prevSelected);
                    if (prevSelected.has(value)) {
                        updatedSelected.delete(value);
                    } else {
                        updatedSelected.add(value);
                    }
                    return updatedSelected;
                });
                break;
            case 'Sustrato':
                setSelectedSustrato((prevSelected) => {
                    const updatedSelected = new Set(prevSelected);
                    if (prevSelected.has(value)) {
                        updatedSelected.delete(value);
                    } else {
                        updatedSelected.add(value);
                    }
                    return updatedSelected;
                });
                break;
            case 'Espesor':
                setSelectedEspesor((prevSelected) => {
                    const updatedSelected = new Set(prevSelected);
                    if (prevSelected.has(value)) {
                        updatedSelected.delete(value);
                    } else {
                        updatedSelected.add(value);
                    }
                    return updatedSelected;
                });
                break;
            case 'Formato':
                setSelectedFormato((prevSelected) => {
                    const updatedSelected = new Set(prevSelected);
                    if (prevSelected.has(value)) {
                        updatedSelected.delete(value);
                    } else {
                        updatedSelected.add(value);
                    }
                    return updatedSelected;
                });
                break;
            // Añadir más casos para otras categorías si es necesario
            default:
                break;
        }
    };


    const StyleFilter = {
        fontColor: '#717171',
        fontSize: '20px',
        marginBottom: '-20px',
    };
    const StyleProducts = {
        fontColor: '#717171',
        fontSize: '15px',
        marginTop: '-10px',
        marginBottom: '15px',
        maxHeight: '150px', // Altura máxima del contenedor de desplazamiento
        overflow: 'auto', // Habilitar el desplazamiento cuando los productos excedan la altura del contenedor

    };

    const StyleUpArrows = {
        fontSize: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'translate(30px, -21px)',
    };

    const StyleDownArrows = {
        fontSize: '10px',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'translate(30px, -21px)',
    };

    const CategoriasStyle = {
        width: '160px',
    }
    const StyleSearchBar = {

    }

    const StyleProductList = {
        display: 'flex',
        flexDirection: 'column', // Muestra los checkbox de manera vertical
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


    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    }


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
                            <div style={CategoriasStyle}>
                                {categories.map((category) => (
                                    <div key={category}>
                                        {category === 'Diseños' && !expandedSections.includes(category) ? (
                                            <div style={StyleFilter} onClick={() => handleSectionToggle(category)}>
                                                {category}
                                                <strong>
                                                    {expandedSections.includes(category) ? (
                                                        <span style={StyleUpArrows}>&#94;</span>
                                                    ) : (
                                                        <span style={StyleDownArrows}>&#5167;</span>
                                                    )}
                                                </strong>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={StyleFilter} onClick={() => handleSectionToggle(category)}>
                                                    {category}
                                                    <strong>
                                                        {expandedSections.includes(category) ? (
                                                            <span style={StyleUpArrows}>&#94;</span>
                                                        ) : (
                                                            <span style={StyleDownArrows}>&#5167;</span>
                                                        )}
                                                    </strong>
                                                </div>
                                                {expandedSections.includes(category) && (
                                                    <div style={StyleProducts}>
                                                        {category === 'Diseños' ? (
                                                            <>
                                                                <div style={StyleSearchBar}>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Buscar productos de diseño..."
                                                                        value={searchText}
                                                                        onChange={(e) => setSearchText(e.target.value)}
                                                                    />
                                                                    <FaSearch />
                                                                </div>
                                                                <div style={StyleProductList}>
                                                                    {filterDiseño()
                                                                        .map((disenoValue) => (
                                                                            <label key={disenoValue}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    onChange={() => handleOptionSelect('Diseños', disenoValue)}
                                                                                    value={disenoValue}
                                                                                />
                                                                                {disenoValue}
                                                                            </label>
                                                                        ))}
                                                                </div>
                                                            </>
                                                        ) : category === 'Linea' ? (
                                                            <div style={StyleProductList}>
                                                                {articulos.map((lineaValue) => (
                                                                    <label key={lineaValue}>
                                                                        <input
                                                                            type="checkbox"
                                                                            onChange={() => handleOptionSelect('Linea', lineaValue)}
                                                                            value={lineaValue}
                                                                        />
                                                                        {lineaValue}
                                                                    </label>

                                                                ))}
                                                            </div>
                                                        ) : category === 'Acabados' ? (
                                                            <div style={StyleProductList}>
                                                                {acabado.map((acabadosValue) => (
                                                                    <label key={acabadosValue}>
                                                                        <input
                                                                            type="checkbox"
                                                                            value={acabadosValue}
                                                                            onChange={() => handleOptionSelect('Acabados', acabadosValue)}
                                                                        />
                                                                        {acabadosValue}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        ) : category === 'Caras' ? (
                                                            <div style={StyleProductList}>
                                                                {caras.map((carasValue) => (
                                                                    <label key={carasValue}>
                                                                        <input
                                                                            type="checkbox"
                                                                            value={carasValue}
                                                                            onChange={() => handleOptionSelect('Caras', carasValue)}
                                                                        />
                                                                        {carasValue}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        ) : category === 'Sustrato' ? (
                                                            <div style={StyleProductList}>
                                                                {sustrato.map((sustratoValue) => (
                                                                    <label key={sustratoValue}>
                                                                        <input
                                                                            type="checkbox"
                                                                            value={sustratoValue}
                                                                            onChange={() => handleOptionSelect('Sustrato', sustratoValue)}
                                                                        />
                                                                        {sustratoValue}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        ) : category === 'Espesor' ? (
                                                            <div style={StyleProductList}>
                                                                {espesor.map((espesorValue) => (
                                                                    <label key={espesorValue}>
                                                                        <input
                                                                            type="checkbox"
                                                                            value={espesorValue}
                                                                            onChange={() => handleOptionSelect('Espesor', espesorValue.toString())}
                                                                        />
                                                                        {espesorValue}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        ) : category === 'Formato' ? (
                                                            <div style={StyleProductList}>
                                                                {formato.map((formatoValue) => (
                                                                    <label key={formatoValue}>
                                                                        <input
                                                                            type="checkbox"
                                                                            value={formatoValue}
                                                                            onChange={() => handleOptionSelect('Formato', formatoValue)}
                                                                        />
                                                                        {formatoValue}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            products
                                                                .filter((product) => product.category === category)
                                                                .map((product) => (
                                                                    <label key={product.id}>
                                                                        <input type="checkbox" />
                                                                        {product.name}
                                                                    </label>
                                                                ))
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <hr style={{ border: 'none', borderTop: '1px solid black', marginTop: '-10px', width: '120px' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='organiza_articulos_Inv row rows-cols1 row-cols-md-3'>
                            {ArticulosConDisponibilidad
                                .filter(articulo => {
                                    if (
                                        selectedLinea.size === 0 &&
                                        selectedAcabados.size === 0 &&
                                        selectedCaras.size === 0 &&
                                        selectedDiseños.size === 0 &&
                                        selectedSustrato.size === 0 &&
                                        selectedEspesor.size === 0 &&
                                        selectedFormato.size === 0
                                        // Añade más condiciones para otras categorías si es necesario
                                    ) {
                                        return true; // Ningún filtro seleccionado, incluir todos los elementos
                                    }

                                    const matchLinea = selectedLinea.size === 0 || selectedLinea.has(articulo[0].atribute1);
                                    const matchAcabados = selectedAcabados.size === 0 || selectedAcabados.has(articulo[0].atribute2);
                                    const matchCaras = selectedCaras.size === 0 || selectedCaras.has(articulo[0].atribute3);
                                    const matchDiseños = selectedDiseños.size === 0 || selectedDiseños.has(articulo[0].atribute4);
                                    const matchSustrato = selectedSustrato.size === 0 || selectedSustrato.has(articulo[0].atribute5);
                                    const matchEspesor = selectedEspesor.size === 0 || selectedEspesor.has(articulo[0].atribute6);
                                    const matchFormato = selectedFormato.size === 0 || selectedFormato.has(articulo[0].atribute7);

                                    // Añade más condiciones de coincidencia para otras categorías si es necesario

                                    return matchLinea && matchAcabados && matchCaras && matchDiseños && matchSustrato && matchEspesor && matchFormato;

                                })
                                .toSorted((a, b) => a[0].item_description_long - b[0].item_description_long) // Ordena el arreglo por cp_user_id en orden ascendente
                                .map((articulo) => (
                                    <td key={articulo[0].inventory_item_id}>
                                        <div className='organiza_img_y_cont'>
                                            <img className='Borde_imagenes'
                                                src={`/public/Articulos/${articulo[0].item_number}.jpg`}
                                                alt=""
                                                style={{ width: '200px', height: '270px' }}
                                            />
                                            <div className='organiza_texto'>
                                                <tr>CÓDIGO ARTÍCULO: {articulo[0].item_number} </tr>
                                                <div className='DescripcionInv'><tr><strong>{articulo[0].item_description_long}</strong>
                                                </tr></div>
                                                <div className='organiza_cant_disp'>
                                                    <tr>Cantidad disponible: {articulo[1].available_to_transact} uds.</tr>
                                                </div>
                                                <div className='PrecioInv'>
                                                    <strong>
                                                        <table>
                                                            <tr>
                                                                <td className="precio-label">Precio:</td>
                                                                <td className="precio-valor">${articulo[2].unit_price.toLocaleString(undefined, opciones) + " " + articulo[2].currency_code}</td>
                                                            </tr>
                                                        </table>
                                                    </strong>
                                                </div>
                                                <div className='organiza_iva_inc'>
                                                    <table>
                                                        <tr>
                                                            <td>${(articulo[2].unit_price + (articulo[2].unit_price * ((ivaFiltrados.length > 0 ? ivaFiltrados[0].cp_IVA : 0) / 100))).toLocaleString(undefined, opciones)} {articulo[2].currency_code} IVA INCLUIDO</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div className='principal_contador_Inv' >

                                                    <td>

                                                        <div className="contador-box" >

                                                            {contadores[articulo[0].inventory_item_id] || 0}

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <div>

                                                            <Col><Button className='decre_incre' onClick={() => incrementarContador(articulo[0].inventory_item_id, articulo[0].atribute9)}><strong>+</strong></Button></Col>

                                                            <Col><Button className='decre_incre2' onClick={() => decrementarContador(articulo[0].inventory_item_id, articulo[0].atribute9)}><strong>-</strong></Button></Col>

                                                        </div>

                                                    </td>

                                                </div>
                                                <div className='organiza_btn_carro_Inv'>
                                                    <Button onClick={() => carritoCompra(articulo, contadores[articulo[0].inventory_item_id])} className='btn_agregar_carro'>
                                                        <FaShoppingCart /><span> Agregar</span>
                                                    </Button>
                                                </div>

                                                <div className='organiza_uni_paq_Inv'>
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