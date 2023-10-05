import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/GestionarUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaRegEdit } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { ModalBody } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { FaSearch } from "react-icons/fa";


const DataTable = ({ backgroundColor }) => {
  const navigate = useNavigate();
  const bannerStyle = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    marginTop: '30px'

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
  const gestion_usua = {
    padding: '60px',
    height: '23vh',
    marginTop: '-35px'
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const [crtUserShow, crtUserSetShow] = useState(false);
  const handleCrtUserClose = () => crtUserSetShow(false);
  const handleCrtUserShow = () => crtUserSetShow(true);

  const [editShow, editSetShow] = useState(false);
  const handleEditClose = () => editSetShow(false);
  const handleEditShow = () => editSetShow(true);

  const [homeShow, homeSetShow] = useState(false);
  const handleHomeClose = () => homeSetShow(false);
  const handleHomeShow = () => homeSetShow(true);

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  const handleCheckbox1Change = () => {
    setCheckbox1(true);
    setCheckbox2(false);
  };
  const handleCheckbox2Change = () => {
    setCheckbox1(false);
    setCheckbox2(true);
  };

  const [checkboxCon1, setCheckboxCon1] = useState(false);
  const [checkboxCon2, setCheckboxCon2] = useState(false);
  const [checkboxCon3, setCheckboxCon3] = useState(false);

  const handleCheckboxCon1Change = () => {
    setCheckboxCon1(true);
    setCheckboxCon2(false);
    setCheckboxCon3(false);
  };
  const handleCheckboxCon2Change = () => {
    setCheckboxCon1(false);
    setCheckboxCon2(true);
    setCheckboxCon3(false);
  };
  const handleCheckboxCon3Change = () => {
    setCheckboxCon1(false);
    setCheckboxCon2(false);
    setCheckboxCon3(true);
  };

  const data = [
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    },
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    },
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    },
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    },
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    },
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    },
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    },
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    }

  ];

  const data_rol = [

    { nombre: 'John Doe', descripcion_rol: 'Creación pedidos', estado: 'Activo' },

    { nombre: 'Jane Doe', descripcion_rol: 'Creación orden', estado: 'Inactivo' }

  ];
  return (
    <>
      <div className='Back' style={backgroundStyle}>
        <Banner />
        <div style={gestion_usua}>
          <tr>
            <td><Container>
              <Row>
                <Col xs={6} md={4}>
                  <Image className='Img-Admin' src={imagenes.Arboles} roundedCircle />
                </Col>
              </Row>
            </Container>
            </td>
            <td><th>ADMIN1 </th><tr><td>Correo</td></tr></td>
          </tr>
        </div>
       
        <Dropdown style={dropDown}>
          <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
            Acciones
          </Dropdown.Toggle>
          <Dropdown.Menu style={dropDownbackgroundStyle}>
            <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Gestión de usuarios</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/Auditoria")}>Auditoria</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/Pedidos")}>Gestionar Pedidos</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/Inventario")}>Organización de Inventarios</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/GestionarUsuario")}>Notificaciones</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
        <div className='DataTable' style={bannerStyle} >
          <table className='table table-borderless' style={bannerStyle} >
            <thead style={bannerStyle}>
              <tr style={bannerStyle} >
                <th style={bannerStyle}>Cliente</th>
                <th style={bannerStyle}>Nombre</th>
                <th style={bannerStyle}>Telefono</th>
                <th style={bannerStyle}>Correo</th>
                <th style={bannerStyle}>Estado</th>
                <th style={bannerStyle}>Rol</th>
                <th style={bannerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody style={bannerStyle}>
              {data.map((item) => (
                <tr style={bannerStyle} key={item}>
                  <td style={bannerStyle}>{item.Cliente}</td>
                  <td style={bannerStyle}>{item.Nombre}</td>
                  <td style={bannerStyle}>{item.Telefono}</td>
                  <td style={bannerStyle}>{item.correo}</td>
                  <td style={bannerStyle}>{item.estado}</td>
                  <td style={bannerStyle}>{item.rol}</td>
                  <td style={bannerStyle}>
                    <button onClick={handleEditShow} className='edit-btn'>
                      <FaRegEdit />
                    </button>
                  </td>
                  <td style={bannerStyle}>
                    <button onClick={handleHomeShow} className='home-btn'>
                      <FaHome />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='Buttons mt-12'>
          <button onClick={handleShow} className='btns p-2 m-2 btn-sm'>Gestionar Roles</button>
          <button onClick={handleCrtUserShow} className='btns p-2 m-2 btn-sm'>Crear usuario</button>
        </div>

        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header className="Gestion_roles" closeButton>
            <Modal.Title>GESTIONAR ROLES</Modal.Title>
          </Modal.Header>
          <Modal.Body className="Gestion_roles">
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <div className='DataTable_GR' style={bannerStyle} >
                  <table className='table table-borderless' style={bannerStyle} >
                    <thead>
                      <tr style={bannerStyle} >
                        <th style={bannerStyle}>Nombre</th>
                        <th style={bannerStyle}>Descripción Rol</th>
                        <th style={bannerStyle}>Estado</th>
                        <th style={bannerStyle}></th>
                      </tr>
                    </thead>

                    <tbody >
                      {data_rol.map((item) => (
                        <tr style={bannerStyle} key={item}>
                          <td style={bannerStyle}>{item.nombre}</td>
                          <td style={bannerStyle}>{item.descripcion_rol}</td>
                          <td style={bannerStyle}>{item.estado}</td>
                          <td style={bannerStyle}><Button className="Btn_contexto" onClick={handleShow3} onClose={handleClose}>
                            Contexto
                          </Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="Gestion_roles">
            <Button className="boton_ges_usua p-2 m-2 btn-sm" onClick={handleShow2}>Crear Rol</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show2} onHide={handleClose2}>
          <Modal.Header className='Create-Rol' closeButton>
            <Modal.Title>ROL</Modal.Title>
          </Modal.Header>
          <Modal.Body className='Create-Rol'>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label><th>CREAR</th></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre Rol"
                  autoFocus
                  disabled
                />

              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control
                  type="text"
                  placeholder="Descripción"
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className='Create-Rol'>
            <Button className="boton_crear_rol p-2 m-2 btn-sm" onClose={handleClose2}> Crear</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show3} onHide={handleClose3}>
          <Modal.Header className="Contexto" closeButton>
          </Modal.Header>
          <Modal.Body className="Contexto">
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label><th>CONTEXTO</th></Form.Label>
              </Form.Group>
              <div>
                <label>
                  <tr><input
                    type="checkbox"
                    checked={checkboxCon2}
                    onChange={handleCheckboxCon2Change}
                  />
                     Crear Pedido
                  </tr>
                  <tr><input
                    type="checkbox"
                    checked={checkboxCon1}
                    onChange={handleCheckboxCon1Change}
                  />
                    Consultar Pedido
                  </tr>
                  <tr>
                    <input
                      type="checkbox"
                      checked={checkboxCon3}
                      onChange={handleCheckboxCon3Change}
                    />
                    Crear pedido sobre inventario
                  </tr>
                </label>
              </div>

            </Form>
          </Modal.Body>
          <Modal.Footer className="Contexto">
            <Button className="Btn_guardar_context p-2 m-2 btn-sm" >
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={crtUserShow} onHide={handleCrtUserClose}>
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title>CREAR USUARIO</Modal.Title>
          </Modal.Header>
          <Modal.Body className='Create-User' >
            <Form >
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de usuario"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                <Form.Label>Correo Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Correo Cliente"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre Cliente"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label>Nombre cliente</Form.Label>
                <Form inline />
                <div className='SearchInventario'>
                  <Form inline>
                    <Row>
                      <Col xs="auto">
                        <Form.Control
                          type="text"
                          placeholder="Buscar"
                          className="mr-sm-2"
                        />
                      </Col>
                      <Col xs="auto">
                        <Button ><FaSearch /></Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                <Form.Label >ROL</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }}
                    controlId="exampleForm.ControlInput4" id="dropdown-basic">
                    Seleccionar rol
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item >Administrador</Dropdown.Item>
                    <Dropdown.Item >Cliente</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className='Create-User' >
            <Button className='Crear-btn' onClick={handleCrtUserClose}>
              Crear
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={editShow} onHide={handleEditClose}>
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title>MODIFICAR DATOS</Modal.Title>
          </Modal.Header>
          <Modal.Body className='Edit-User' >
            <Form >
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de usuario"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                <Form.Label>Correo Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Correo Cliente"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre Cliente"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label>Nombre cliente</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }}
                    controlId="exampleForm.ControlInput5" id="dropdown-basic">
                    Seleccionar Cliente
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item >Cliente 1</Dropdown.Item>
                    <Dropdown.Item >Cliente 2</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                <Form.Label >ROL</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }}
                    controlId="exampleForm.ControlInput7" id="dropdown-basic">
                    Seleccionar rol
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item >Administrador</Dropdown.Item>
                    <Dropdown.Item >Cliente</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <div className='CheckBox'>
                <label>
                  <input
                    type="checkbox"
                    checked={checkbox1}
                    onChange={handleCheckbox1Change}
                  />
                  Inactivo
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={checkbox2}
                    onChange={handleCheckbox2Change}
                  />
                  Activo
                </label>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className='Create-User' >

            <Button className='Crear-btn' onClick={handleEditClose}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal size="lg"
          show={homeShow} onHide={handleHomeClose} aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title>CREAR USUARIO</Modal.Title>
          </Modal.Header>
          <ModalBody >
            <div style={bannerStyle} >
              <table className='table table-borderless' style={bannerStyle}>
                <thead style={bannerStyle}>
                  <tr style={bannerStyle}>
                    <th style={bannerStyle}>Dirección</th>
                    <th style={bannerStyle}>Dpt</th>
                    <th style={bannerStyle}>Ciudad</th>
                    <th style={bannerStyle}>Pais</th>
                    <th style={bannerStyle}>Vendedor</th>
                    <th style={bannerStyle}>Tipo de pedido</th>
                  </tr>
                </thead>
                <tbody style={bannerStyle}>
                  {data.map((item) => (
                    <tr style={bannerStyle} key={item}>
                      <td style={bannerStyle}>{item.Cliente}</td>
                      <td style={bannerStyle}>{item.Nombre}</td>
                      <td style={bannerStyle}>{item.Telefono}</td>
                      <td style={bannerStyle}>{item.correo}</td>
                      <td style={bannerStyle}>{item.estado}</td>
                      <td style={bannerStyle}>{item.rol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
          <Modal.Footer className='Create-User' >
            <Button className='Crear-btn' onClick={handleHomeClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>

  );

};
export default DataTable;
