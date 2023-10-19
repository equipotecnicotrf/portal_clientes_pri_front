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
import FiltroDropdownCheckbox from './Filtro';
import { FaShoppingCart } from "react-icons/fa";
import AvailabilityService from '../../services/AvailabilityService';

const DataInventario = () => {
    const [usuarioSesion, setUarioSesion] = useState([]);
    const [usuarioCorreo, setUsuarioCorreo] = useState([]);
    const [usuarioTelefono, setUsuarioTelefono] = useState([]);
    const [usuarioEmpresa, setUsuarioEmpresa] = useState([]);
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
        try {
            const [articulosDisponibles, disponibilidad] = await Promise.all([
                ItemService.getItemsConDisponibilidad(),
                AvailabilityService.getallAvailability()
            ]);

            const disponibilidadMap = new Map(disponibilidad.data.map(item => [item.inventory_item_id, item.available_to_transact]));

            const articulosConDisponibilidad = articulosDisponibles.data.map(articulo => {
                const cantidad = disponibilidadMap.get(articulo.inventory_item_id) || 0;
                return { ...articulo, cantidad };
            });

            setArticulosConDisponibilidad(articulosConDisponibilidad);
        } catch (error) {
            console.error(error);
        }
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

    const incrementarContador = (inventory_item_id) => {
        setContadores(prevContadores => {
            const nuevoContador = { ...prevContadores };
            nuevoContador[inventory_item_id] = (nuevoContador[inventory_item_id] || 0) + 1;
            return nuevoContador;
        });
    };

    const decrementarContador = (inventory_item_id) => {
        setContadores(prevContadores => {
            const nuevoContador = { ...prevContadores };
            if (nuevoContador[inventory_item_id] > 0) {
                nuevoContador[inventory_item_id] -= 1;
            }
            return nuevoContador;
        });
    };

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
                        <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataTablePerfilUser")}>Perfil</button>
                        <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataInventario")}>Inventario Disponible</button>
                        <button className='btns_inventario p-2 m-2 btn-sm' onClick={() => navigate("/DataPedido")}>Haz tu pedido</button>
                        <button className='btns_inventario p-2 m-2 btn-sm'>Consulta tu pedido</button>
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
                            <FiltroDropdownCheckbox
                                opciones={opcionesDropdown}
                                checkboxOpciones={opcionesCheckbox}
                                onFilter={handleFilter}
                            />
                            {/* Resto de tu aplicación */}
                        </div>
                        <div className='organiza_articulos row rows-cols1 row-cols-md-3'>
                            {ArticulosConDisponibilidad
                                .toSorted((a, b) => a.inventory_item_id - b.inventory_item_id) // Ordena el arreglo por cp_user_id en orden ascendente
                                .map((articulo) => (
                                    <td key={articulo.inventory_item_id}>
                                        <div className='organiza_img_y_cont'>
                                            <img className='Borde_imagenes'
                                                src={imagenes.Arboles}
                                                alt=""
                                                style={{ width: '200px', height: '270px' }}
                                            />
                                            <div className='organiza_texto'>
                                                <tr>CÓDIGO ARTÍCULO: {articulo.item_number} </tr>
                                                <tr><strong>{articulo.item_description_long}</strong></tr>
                                                <tr><strong>{articulo.atribute3 + " caras " + articulo.atribute1 + " " + articulo.atribute6 + "mm" + " " + articulo.atribute7 + "m10"}</strong></tr>
                                                <div className='organiza_cant_disp'>
                                                    <tr>Cantidad disponible: {articulo.cantidad}</tr>
                                                </div>
                                                <tr><strong>Precio: "precio"</strong></tr>
                                                <div className='organiza_iva_inc'>
                                                    <tr>"precio" IVA INCLUIDO</tr>
                                                </div>
                                                <div className='organiza_btn_carro'>
                                                    <Button className='btn_agregar_carro'>
                                                        <FaShoppingCart /><span> Agregar</span>
                                                    </Button>
                                                </div>
                                                <div className='principal_contador'>
                                                    <td>
                                                        <div className="contador-box">
                                                            {contadores[articulo.inventory_item_id] || 0}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Col><Button className='decre_incre' onClick={() => incrementarContador(articulo.inventory_item_id)}>+</Button></Col>
                                                        <Col><Button className='decre_incre' onClick={() => decrementarContador(articulo.inventory_item_id)}>-</Button></Col>
                                                    </td>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                ))}
                        </div>
                    </div>
                </div>
                <Image className='Img-Creamos_ped' src={imagenes.Creamos} />
            </div>{/*AJUSTE LCPG*/}
        </>
    );
};

export default DataInventario;