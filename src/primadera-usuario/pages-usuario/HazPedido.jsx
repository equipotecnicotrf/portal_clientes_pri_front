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
import FiltroDropdownCheckbox from './Filtro';
import { FaShoppingCart, FaUser, FaSearchMinus, FaTruck } from "react-icons/fa";

import { Modal } from 'react-bootstrap';

const DataPedido = () => {

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
        { imagen: 'Restos', codigo: '0000060', nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10', cantidad: '1000 und', precio: '$9.99' },

        { imagen: 'Arboles', codigo: '0000060', nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10', cantidad: '1000 und', precio: '$9.99' },

        { imagen: 'Arboles', codigo: '0000060', nombre: 'Primacor Jayka Luna 1', descripcion: '2 caras ST18mm 1,83x2,44m10', cantidad: '1000 und', precio: '$9.99' },
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
                                <tr><th>{usuarioSesion}</th></tr>
                                <tr> Empresa </tr>
                                <tr>{usuarioCorreo}</tr>
                                <tr>Telefono</tr>
                            </td>
                        </tr>
                    </div>



                    <div className='ContenedorPadrePedi'>

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

                            {productos.map(producto => (

                                <td key={producto.imagen}>

                                    <div className='organiza_img_y_cont'>
                                        <img className='Borde_imagenes'
                                            src={imagenes[producto.imagen]}
                                            alt={producto.nombre}
                                            style={{ width: '200px', height: '270px' }}
                                        />

                                        <div className='organiza_texto'>
                                            <tr>CÓDIGO ARTÍCULO:{producto.codigo}</tr>
                                            <tr><strong>{producto.nombre}</strong></tr>
                                            <tr><strong>{producto.descripcion}</strong></tr>

                                            <tr><strong>Precio: {producto.precio}</strong></tr>
                                            <div className='organiza_iva_inc'>
                                                <tr>{producto.precio} IVA INCLUIDO</tr>
                                            </div>
                                            <div className='organiza_btn_carro'>
                                                <Button onClick={handleShow} className='btn_agregar_carro'>
                                                    <FaShoppingCart /><span> Agregar</span>
                                                </Button>
                                            </div>

                                            <div className='principal_contador'>
                                                <td>
                                                    <div className="contador-box">
                                                        {contador}
                                                    </div>
                                                </td>
                                                <td>
                                                    <Col><Button className='decre_incre' onClick={incrementarContador}>+</Button></Col>
                                                    <Col><Button className='decre_incre' onClick={decrementarContador}>-</Button></Col>
                                                </td>
                                            </div>
                                            <div className='organiza_uni_paq'>

                                                <tr>Unidades por paquete</tr>

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