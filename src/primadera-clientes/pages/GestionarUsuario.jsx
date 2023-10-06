import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/GestionarUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaHome, FaRegEdit } from "react-icons/fa";
import { ModalBody } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Cookies from 'js-cookie';
import LoginService from '../../services/LoginService';
import UserService from '../../services/UserService';
import AuditService from '../../services/AuditService';
import SoapService from '../../services/SoapService';
import RoleService from '../../services/RoleService';
import { FaSearch } from "react-icons/fa";

const DataTable = ({ backgroundColor }) => {
  const [selectedOption, setSelectedOption] = useState('Acciones');

  //validacion de sesion activa
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

  // consulta de usuarios
  const [users, setUsers] = useState([]);
  //Para traer nombres de los roles
  const [usernameRol, SetUsernameRol] = useState([]);
  useEffect(() => {
    ListUsers()
  }, [])

  useEffect(() => {
    obtenerNombresDeRol();
  }, [users]);

  const ListUsers = () => {
    UserService.getAllUsers().then(response => {
      setUsers(response.data);
      //console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const obtenerNombresDeRol = async () => {
    try {
      const userPromises = users.map(async (user) => {
        try {
          const rolResponse = await RoleService.getrolById(user.cp_rol_id);
          const rol = rolResponse.data;
          return { id: user.cp_rol_id, username: rol.cp_rol_name };
        } catch (error) {
          console.error(`Error obteniendo el usuario con ID ${user.cp_rol_id}: ${error}`);
          return { id: user.cp_rol_id, username: "N/A" }; // Puedes proporcionar un valor predeterminado si la obtención falla
        }
      })

      const usersRoles = await Promise.all(userPromises);

      // Convertir el arreglo de auditorías a un objeto de usernames para un acceso más eficiente
      const nameRolObject = {};
      usersRoles.forEach((rol) => {
        nameRolObject[rol.id] = rol.username;
      })

      SetUsernameRol(nameRolObject);
    } catch (error) {
      console.error(`Error obteniendo nombres de usuario: ${error}`);
    }
  }

  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cp_password, setCp_Password] = useState('');
  const [cp_cell_phone, setCp_Cell_Phone] = useState('');
  const [cp_email, setcp_Email] = useState('');
  const [cp_status, setcp_Status] = useState('');
  const [cp_name, setcp_Name] = useState('');
  const [cp_rol_id, setcp_Rol_Id] = useState('');
  const [cust_account_id, set_CustAccount_Id] = useState('');
  const [cust_name, set_Cust_Name] = useState('');
  const [party_id, set_Party_Id] = useState('');
  const [cp_username, setcp_username] = useState('');
  const { id } = useParams();



  // consulta reporte cliente  
  useEffect(() => {
    ListClientes()
  }, [])

  const ListClientes = () => {
    SoapService.getAllClientes().then(response => {
      setClientes(response.data);
      //console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const handleClienteSelect = (cliente) => {
    setSelectedCliente(cliente);
    setSearchTerm('');
    set_CustAccount_Id(cliente.custAccountId);
    set_Cust_Name(cliente.accountName);
    set_Party_Id(cliente.partyId);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = clientes.filter((cliente) =>
      cliente.accountName.toLowerCase().includes(searchTerm)
    );
    setFilteredClientes(filtered);
  };

  //Crear usuario

  const CrearUser = () => {
    const cp_Password = "PortalClientes";
    const username = cp_email;
    const cp_estatus = "Activo";
    const userCreate = { username, cust_account_id, cust_name, party_id, cp_name, cp_Password, cp_email, cp_estatus, cp_rol_id, cp_cell_phone };

    UserService.createUsers(userCreate).then((response) => {
      console.log(response.data);

      const read = Cookies.get()
      UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
        console.log(responseid.data)


        const cp_id_user = responseid.data.cp_user_id;
        const cp_audit_description = "Creacion Usuario " + username;
        const Audit = { cp_id_user, cp_audit_description };

        AuditService.CrearAudit(Audit).then((Response) => {
          console.log(response.data);
          navigate('/GestionarUsuario');
          alert("Usuario Creado Exitosamente");
          window.location.reload();
        }).catch(error => {
          console.log(error)
          alert("Error al crear auditoria")
        })
      }).catch(error => {
        console.log(error)
        alert("Error obtener usuario de sesion")
      })

    }).catch(error => {
      console.log(error);
      alert("Error al Crear Usuaario")
    })
  }

  //roles
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [searchTermRoles, setSearchTermRoles] = useState('');
  const [cp_rol_name, setcp_rol_name] = useState('');
  const [cp_rol_description, setcp_rol_description] = useState('');
  const [cp_rol_status, setcp_rol_status] = useState('');


  // consulta de roles
  useEffect(() => {
    ListRoles()
  }, [])

  const ListRoles = () => {
    RoleService.getAllRoles().then(response => {
      setRoles(response.data);
      //console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const handleRolesSelect = (rolUser) => {
    setSelectedRoles(rolUser);
    setSearchTermRoles('');
    setcp_Rol_Id(rolUser.cp_rol_id);
  };

  const handleSearchChangeRoles = (e) => {
    const searchTermRoles = e.target.value.toLowerCase();
    setSearchTermRoles(searchTermRoles);

    const filteredRoles = roles.filter((rolUser) =>
      rolUser.cp_rol_name.toLowerCase().includes(searchTermRoles)
    );
    setFilteredRoles(filteredRoles);
  };

  //crear rol
  const CrearRol = () => {
    const cp_rol_status = "Activo";
    const Rol = { cp_rol_name, cp_rol_description, cp_rol_status };
    RoleService.createRoles(Rol).then((response) => {
      console.log(response.data);

      const read = Cookies.get()
      UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
        console.log(responseid.data)
        const cp_id_user = responseid.data.cp_user_id;
        const cp_audit_description = "Creacion rol " + cp_rol_name + " " + cp_rol_description;
        const Audit = { cp_id_user, cp_audit_description };
        AuditService.CrearAudit(Audit).then((Response) => {
          console.log(response.data);
          navigate('/GestionarUsuario');
          alert("Rol Creado Exitosamente");
          window.location.reload();
        }).catch(error => {
          console.log(error)
          alert("Error al crear auditoria")
        })
      }).catch(error => {
        console.log(error)
        alert("Error obtener usuario de sesion")
      })
    }).catch(error => {
      console.log(error)
      alert("Error al Crear Rol")
    })
  }

  const bannerStyle = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    marginTop: '30px'

  };

  const bannerStyle2 = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '2%',
    textAlign: 'center',
  };

  const bannerStyle3 = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '2%',
    textAlign: 'left',
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
  {/*AJUSTE LCPG*/ }
  const gestion = {
    padding: '20px',

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
            <td><th>{usuarioSesion}</th><tr><td>{usuarioCorreo}</td></tr></td>
          </tr>
        </div>

        <Dropdown style={dropDown}>
          <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
            {selectedOption}
          </Dropdown.Toggle>
          <Dropdown.Menu style={dropDownbackgroundStyle}>
            <Dropdown.Item onClick={() => { setSelectedOption('Gestión de usuarios'); navigate("/GestionarUsuario"); }}>Gestión de usuarios</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoria</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>


        <div className='DataTable' style={bannerStyle} >
          <th style={gestion}>GESTIÓN DE USUARIO </th>
          <div className='busc_gest_usua'>
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
                  <Button className='gest_usua'><FaSearch /></Button>
                </Col>
              </Row>
            </Form>
          </div>
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
              {users
                .toSorted((a, b) => a.cp_user_id - b.cp_user_id) // Ordena el arreglo por cp_user_id en orden ascendente
                .map((users) => (
                  <tr style={bannerStyle} key={users.cp_user_id}>
                    <td style={bannerStyle}>{users.cust_name}</td>
                    <td style={bannerStyle}>{users.cp_name}</td>
                    <td style={bannerStyle}>{users.cp_cell_phone}</td>
                    <td style={bannerStyle}>{users.cp_email}</td>
                    <td style={bannerStyle}>{users.cp_estatus}</td>
                    <td style={bannerStyle}>{usernameRol[users.cp_rol_id] ? (<span>{usernameRol[users.cp_rol_id]}</span>) : (<span>Cargando...</span>)}</td>
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
                <div>
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
                      {roles
                        .toSorted((a, b) => a.cp_rol_id - b.cp_rol_id) // Ordena el arreglo por cp_rol_id en orden ascendente
                        .map((roles) => (
                          <tr style={bannerStyle} key={roles.cp_rol_id}>
                            <td style={bannerStyle}>{roles.cp_rol_name}</td>
                            <td style={bannerStyle}>{roles.cp_rol_description}</td>
                            <td style={bannerStyle}>{roles.cp_rol_status}</td>
                            <td style={bannerStyle2}><Button className="Btn_contexto" onClick={handleShow3} onClose={handleClose}>
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
                <Form.Label><th>CREAR ROL</th></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre Rol"
                  autoFocus
                  value={cp_rol_name}
                  onChange={(e) => setcp_rol_name(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Control
                  type="text"
                  placeholder="Descripción"
                  autoFocus
                  value={cp_rol_description}
                  onChange={(e) => setcp_rol_description(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className='Create-Rol'>
            <Button className="boton_crear_rol p-2 m-2 btn-sm" onClose={handleClose2} onClick={(e) => CrearRol(e)} > Crear</Button>
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
                <Form>
                  <Form.Group>
                    <Form.Check type="checkbox">
                      <Form.Check.Input checked={checkboxCon2}
                        onChange={handleCheckboxCon2Change} />
                      <Form.Check.Label>Crear Pedido</Form.Check.Label>
                    </Form.Check>
                    <Form.Check type="checkbox">
                      <Form.Check.Input checked={checkboxCon1}
                        onChange={handleCheckboxCon1Change} />
                      <Form.Check.Label>Consultar Pedido</Form.Check.Label>
                    </Form.Check>
                    <Form.Check type="checkbox">
                      <Form.Check.Input checked={checkboxCon3}
                        onChange={handleCheckboxCon3Change} />
                      <Form.Check.Label>Crear pedido sobre inventario</Form.Check.Label>
                    </Form.Check>
                  </Form.Group>
                </Form>
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
                  value={cp_name}
                  onChange={(e) => setcp_Name(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                <Form.Label>Correo Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Correo Cliente"
                  autoFocus
                  value={cp_email}
                  onChange={(e) => setcp_Email(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Telefono"
                  autoFocus
                  value={cp_cell_phone}
                  onChange={(e) => setCp_Cell_Phone(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label>Nombre cliente</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlId="exampleForm.ControlInput4" id="dropdown-basic">
                    {selectedCliente ? selectedCliente.accountName : 'Seleccionar Cliente'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form.Control
                      type="text"
                      placeholder="Buscar Cliente"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    {filteredClientes.map((cliente) => (
                      <Dropdown.Item
                        key={cliente.custAccountId}
                        onClick={() => handleClienteSelect(cliente)}                     >
                        {cliente.accountName}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                <Form.Label >ROL</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlId="exampleForm.ControlInput5" id="dropdown-basic">
                    {selectedRoles ? selectedRoles.cp_rol_name : 'Seleccionar Rol'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form.Control
                      type="text"
                      placeholder="Buscar rol"
                      value={searchTermRoles}
                      onChange={handleSearchChangeRoles}
                    />
                    {filteredRoles.map((rolUser) => (
                      <Dropdown.Item
                        key={rolUser.cp_rol_id}
                        onClick={() => handleRolesSelect(rolUser)}                     >
                        {rolUser.cp_rol_name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className='Create-User' >
            <Button className='Crear-btn' onClick={(e) => CrearUser(e)}>
              Crear
            </Button>
          </Modal.Footer>
        </Modal>




        <Modal show={editShow} onHide={handleEditClose}>
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title>MODIFICAR DATOS</Modal.Title>
          </Modal.Header>
          <Modal.Body style={bannerStyle3} className='Edit-User'>
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
                  placeholder="Correo Usuario"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Telefono"
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
              <div className='CheckBox'> {/*AJUSTE LCPG INICIO*/}
                <Form className='CheckBox'>

                  <Form.Group className='Checkbox_estado'>
                    <Form.Check type="checkbox">
                      <Form.Check.Label>Inactivo</Form.Check.Label>
                      <Form.Check.Input checked={checkbox1} onChange={handleCheckbox1Change} />
                    </Form.Check>
                  </Form.Group>

                  <Form.Group className='Checkbox_estado'>
                    <Form.Check type="checkbox">
                      <Form.Check.Label>Activo</Form.Check.Label>
                      <Form.Check.Input checked={checkbox2} onChange={handleCheckbox2Change} />
                    </Form.Check>
                  </Form.Group>

                </Form>
              </div> {/*AJUSTE LCPG FIN*/}
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
            <Modal.Title>GESTIONAR DIRECCIONES</Modal.Title>
          </Modal.Header>
          <ModalBody className='Create-User'>
            <div>
              <table className='table table-borderless'>
                <thead >
                  <tr >
                    <th >Dirección</th>
                    <th >Dpt</th>
                    <th >Ciudad</th>
                    <th >Pais</th>
                    <th >Vendedor</th>
                    <th >Tipo de pedido</th>
                  </tr>
                </thead>
                <tbody >
                  {data.map((item) => (
                    <tr key={item}>
                      <td >{item.Cliente}</td>
                      <td >{item.Nombre}</td>
                      <td >{item.Telefono}</td>
                      <td >{item.correo}</td>
                      <td >{item.estado}</td>
                      <td >{item.rol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
          <Modal.Footer className='Create-User' >
            <Button className='Crear-btn' onClick={handleHomeClose}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
        <Image className='Img_gest_usua' src={imagenes.Creamos} />
      </div>
    </>

  );

};
export default DataTable;
