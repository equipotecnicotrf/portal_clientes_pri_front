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
import { FaHome, FaRegEdit, FaSearch, FaStar, FaUser } from "react-icons/fa";
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
import SoapServiceDirecciones from '../../services/SoapServiceDirecciones';
import AddressService from '../../services/AddressService';
import TypeOrderService from '../../services/TypeOrderService';
import EmailService from '../../services/EmailService';
import NotificationService from '../../services/NotificationService';

const DataTable = ({ backgroundColor }) => {
  const [selectedOption, setSelectedOption] = useState('Acciones');

  //validacion de sesion activa
  const [usuarioSesion, setUarioSesion] = useState([]);
  const [usuarioCorreo, setUsuarioCorreo] = useState([]);
  const [usuariotelefono, setUsuarioTelefono] = useState([]);
  const [searchText, setSearchText] = useState(''); // Nuevo estado para el texto de búsqueda
  const navigate = useNavigate();
  useEffect(() => {
    SesionUsername()
  }, [])

  const SesionUsername = () => {
    if (LoginService.isAuthenticated()) {
      // Renderizar la vista protegida
      const read = Cookies.get()
      UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
        setUarioSesion(responseid.data.cp_name);
        setUsuarioCorreo(responseid.data.username);
        setUsuarioTelefono(responseid.data.cp_cell_phone);
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
  useEffect(() => {
    ListUsers()
  }, [])

  const ListUsers = () => {
    UserService.getAllUsersandRoles().then(response => {
      setUsers(response.data);
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  // Función para filtrar auditorías según el texto de búsqueda
  const filterUsuario = () => {
    return users.filter((users) => {
      const usersText = `${users[0].cp_email} ${users[0].cp_name}${users[0].cust_name}`;
      return usersText.toLowerCase().includes(searchText.toLowerCase());
    });
  };

  //Para traer nombres de los roles
  const [usernameRol, SetUsernameRol] = useState([]);
  useEffect(() => {
    obtenerNombresDeRol();
  }, [users]);

  const obtenerNombresDeRol = async () => {
    try {
      const userPromises = users.map(async (user) => {
        try {
          const rolResponse = await RoleService.getrolById(user[0].cp_rol_id);
          const rol = rolResponse.data;
          return { id: user[0].cp_rol_id, username: rol.cp_rol_name };
        } catch (error) {
          console.error(`Error obteniendo el usuario con ID ${user[0].cp_rol_id}: ${error}`);
          return { id: user[0].cp_rol_id, username: "N/A" }; // Puedes proporcionar un valor predeterminado si la obtención falla
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

  // constantes de usuarios
  const [cp_password, setCp_Password] = useState('');
  const [cp_cell_phone, setCp_Cell_Phone] = useState('');
  const [cp_email, setcp_Email] = useState('');
  const [payment_terms, setpayment_terms] = useState('');
  const [transactional_currency_code, settransactional_currency_code] = useState('');
  const [cp_estatus, setcp_Estatus] = useState('');
  const [cp_name, setcp_Name] = useState('');
  const [cp_rol_id, setcp_Rol_Id] = useState('');
  const [cust_account_id, set_CustAccount_Id] = useState('');
  const [cust_name, set_Cust_Name] = useState('');
  const [party_id, set_Party_Id] = useState('');
  const [cp_type_order_id, setcp_type_order_id] = useState('');
  const [cp_user_id, setcp_User_Id] = useState('');
  const [editUserId, setEditUserId] = useState(null); // Add a state variable for editing
  const [isChecked, setIsChecked] = useState(false); // Estado inicial

  //Listar usuario para actualizar
  const ListUsuarioActualizar = (id_user) => {
    UserService.getUserById(id_user).then(response => {
      setcp_Name(response.data.cp_name);
      setcp_Email(response.data.cp_email);
      setCp_Cell_Phone(response.data.cp_cell_phone);
      set_CustAccount_Id(response.data.cust_account_id);
      set_Cust_Name(response.data.cust_name);
      set_Party_Id(response.data.party_id);
      setcp_Rol_Id(response.data.cp_rol_id);
      setcp_Estatus(response.data.cp_estatus);
      setpayment_terms(response.data.payment_terms);
      settransactional_currency_code(response.data.transactional_currency_code);
      setcp_type_order_id(response.data.cp_type_order_id)
      if (response.data.cp_estatus === "Activo") {
        setCheckbox2(true); // Activo
        setCheckbox1(false)
      } else {
        setCheckbox2(false); // Inactivo
        setCheckbox1(true)
      }
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    // Validación del correo electrónico
    const isEmailValid = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(cp_email);
    // Validación del número de teléfono
    const phoneNumber = parseInt(cp_cell_phone, 10);
    const isPhoneNumberValid = !isNaN(phoneNumber) && String(phoneNumber).length === 10;
    if (!isEmailValid) {
      alert("Por favor, ingrese un correo electrónico válido.");
    } else if (!isPhoneNumberValid) {
      alert("Por favor, ingrese un número de teléfono válido de 10 dígitos.");
    } else {
      // Crear o actualizar el usuario
      saveOrUpdateUser();
    }
    setValidated(true);
  }

  //Crear usuario o actualizar usuario
  const saveOrUpdateUser = (e) => {
    if (editUserId) {
      // Update an existing record
      const read = Cookies.get()
      UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
        console.log(responseid.data)
        if (responseid.data.cp_user_id == editUserId) {
          const cp_estatus = (checkbox2 ? "Activo" : checkbox1 ? "Inactivo" : cp_estatus);
          if (cp_estatus == 'Inactivo') {
            alert("no se puede inactivar su cuenta")
          }
          else {
            const username = cp_email;
            const cp_estatus = (checkbox2 ? "Activo" : checkbox1 ? "Inactivo" : cp_estatus);
            const UserEdit = { username, cust_account_id, cust_name, party_id, cp_name, cp_email, cp_estatus, cp_rol_id, cp_cell_phone, payment_terms, transactional_currency_code, cp_type_order_id }
            UserService.updateUser(editUserId, UserEdit).then((response) => {
              console.log(responseid.data)
              const cp_id_user = responseid.data.cp_user_id;
              const cp_audit_description = "Actualizacion de usuario " + username;
              const Audit = { cp_id_user, cp_audit_description };
              AuditService.CrearAudit(Audit).then((response) => {
                console.log(response.data);
                navigate('/GestionarUsuario');
                alert("Usuario Actualizado Exitosamente");
                window.location.reload();
              }).catch(error => {
                console.log(error)
                alert("Error al crear auditoria")
              })
            }).catch((error) => {
              console.log(error);
              alert("Error al actualizar Usuario, Por favor diligenciar todos los campos")
            });
          }
        } else {
          const username = cp_email;
          const cp_estatus = (checkbox2 ? "Activo" : checkbox1 ? "Inactivo" : cp_estatus);
          const UserEdit = { username, cust_account_id, cust_name, party_id, cp_name, cp_email, cp_estatus, cp_rol_id, cp_cell_phone, payment_terms, transactional_currency_code, cp_type_order_id }
          UserService.updateUser(editUserId, UserEdit).then((response) => {
            console.log(responseid.data)
            const cp_id_user = responseid.data.cp_user_id;
            const cp_audit_description = "Actualizacion de usuario " + username;
            const Audit = { cp_id_user, cp_audit_description };
            AuditService.CrearAudit(Audit).then((response) => {
              console.log(response.data);
              navigate('/GestionarUsuario');
              alert("Usuario Actualizado Exitosamente");
              window.location.reload();
            }).catch(error => {
              console.log(error)
              alert("Error al crear auditoria")
            })
          }).catch((error) => {
            console.log(error);
            alert("Error al actualizar Usuario, Por favor diligenciar todos los campos")
          });
        }

      }).catch(error => {
        console.log(error)
        alert("Error obtener usuario de sesion")
      })
    } else {
      // Create a new record
      const existingType = users.find(item => item.cp_email === cp_email);
      if (existingType) {
        alert("Ya existe un usuario con ese correo.");
      } else {
        const cp_Password = "PortalClientes";
        const username = cp_email;
        const cp_estatus = "Activo";
        const userCreate = { username, cust_account_id, cust_name, party_id, cp_name, cp_Password, cp_email, cp_estatus, cp_rol_id, cp_cell_phone, payment_terms, transactional_currency_code, cp_type_order_id };
        UserService.createUsers(userCreate).then((responsecreate) => {
          console.log(responsecreate.data);
          const read = Cookies.get()
          UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
            console.log(responseid.data)
            const cp_id_user = responseid.data.cp_user_id;
            const cp_audit_description = "Creacion Usuario " + username;
            const Audit = { cp_id_user, cp_audit_description };
            AuditService.CrearAudit(Audit).then((response) => {
              console.log(response.data);

              const context = "Creacion Usuario";
              NotificationService.getNotificationsContext(context).then((notificatioresponse) => {
                console.log(notificatioresponse.data)
                const toUser = [cp_email];
                const subject = notificatioresponse.data[0].cp_Notification_name;
                const resetPasswordLink = `http://150.136.119.119:83/ActualizarPassword/?userId=${responsecreate.data.cp_user_id}`;
                const notificationMessage = notificatioresponse.data[0].cp_Notification_message;
                const message = notificationMessage
                  .replace('${nombreusuario}', responsecreate.data.cp_name)
                  .replace('${resetPasswordLink}', resetPasswordLink);
                const correo = { toUser, subject, message };
                EmailService.Sendmessage(correo).then(() => {
                  navigate('/GestionarUsuario');
                  alert("Usuario Creado Exitosamente");
                  window.location.reload();
                }).catch(error => {
                  console.log(error);
                  alert("Error al enviar correo");
                })
              }).catch(error => {
                console.log(error);
                alert("Error obtener contexto de notificacion");
              })
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
          alert("Error al Crear Usuario, Por favor diligenciar todos los campos")
        })
      }
    }
  };


  //constantes para clientes
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // consulta reporte cliente 
  useEffect(() => {
    ListClientes()
  }, [])

  const ListClientes = () => {
    SoapService.getAllClientes().then(response => {
      setClientes(response.data);
      console.log(response.data);
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
    setpayment_terms(cliente.paymentTerms);
    settransactional_currency_code(cliente.transactionalCurrencyCode);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = clientes.filter((cliente) =>
      cliente.accountName.toLowerCase().includes(searchTerm)
    );
    setFilteredClientes(filtered);
  };

  //servicio de direcciones
  //Traer direcciones
  const [direcciones, setDirecciones] = useState([]);

  //Listar direcciones
  const ListDirecciones = (id_direccion) => {
    SoapServiceDirecciones.getAllDirecciones(id_direccion).then(response => {
      setDirecciones(response.data);
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  /*
  //Función para guardar las direcciones
  function guardarDireccion() {
    for (let i = 0; i < direcciones.length; i++) {
      const element = direcciones[i];
      const site_use_id = (parseInt(element.siteUseId));
      const address = (element.address1);
      const city = (element.city);
      const department = (element.state);
      const organization_id = 300000192342222;
      const party_site_id = (parseInt(element.partySiteId));
      //const cp_type_order_id = 1;
      const sales_person_code = (parseInt(element.codVendedor));
      const sales_person_name = (element.nameVendedor);
      const site_use_code = (element.siteUseCode);
      const cust_account_id = (parseInt(element.custAccountId))
      const direccion = { site_use_id, address, city, department, organization_id, party_site_id, cp_type_order_id, sales_person_code, sales_person_name, site_use_code, cust_account_id };

      AddressService.postAddress(direccion).then(response => {
        console.log(response.data)
        const read = Cookies.get()
        UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
          console.log(responseid.data)
          const cp_id_user = responseid.data.cp_user_id;
          const cp_audit_description = "Creacion de dirección con id " + site_use_id + " " + address + ", " + city + ", " + department + " y " + site_use_code;
          const Audit = { cp_id_user, cp_audit_description };
          AuditService.CrearAudit(Audit).then((response) => {
            console.log(response.data);
            navigate('/GestionarUsuario');
            alert("La dirección se ha guardado correctamente")
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
        alert("Fallo al crear dirección")
      })
    }
  }
  */

  //listar tipo de pedidos
  const [tipoPedido, setTipoPedido] = useState([]);
  const [filteredTipoPedido, setFilteredTipoPedido] = useState([]);
  const [selectedTipoPedido, setSelectedTipoPedido] = useState(null);
  const [searchTermTipoPedido, setSearchTermTipoPedido] = useState('');



  // consulta de tipos de pedido
  useEffect(() => {
    ListTipoPedido()
  }, [])

  const ListTipoPedido = () => {
    TypeOrderService.getAllTypeOrder().then(response => {
      setTipoPedido(response.data);
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const handleTipoPedidoSelect = (Pedido) => {
    setSelectedTipoPedido(Pedido);
    setSearchTermTipoPedido('');
    setcp_type_order_id(Pedido.cp_type_order_id);
  };

  const handleSearchChangeTipoPedido = (e) => {
    const searchTermTipoPedido = e.target.value.toLowerCase();
    setSearchTermTipoPedido(searchTermTipoPedido);

    const filteredTipoPedido = tipoPedido.filter((Pedido) =>
      Pedido.cp_type_order_description.toLowerCase().includes(searchTermTipoPedido)
    );
    setFilteredTipoPedido(filteredTipoPedido);
  };

  const [descripcionTipoPedido, setDescripcionTipoPedido] = useState('');

  useEffect(() => {
    if (cp_type_order_id && tipoPedido && tipoPedido.length > 0) {
      // Busca el objeto TipoPedido con el cp_type_order_id correspondiente.
      const tipoPedidoEncontrado = tipoPedido.find(item => item.cp_type_order_id === cp_type_order_id);

      if (tipoPedidoEncontrado) {
        // Si se encuentra el tipo de pedido, establece su descripción en algún lugar que necesites, por ejemplo, en un estado.
        setDescripcionTipoPedido(tipoPedidoEncontrado.cp_type_order_description);
      }
    }
  }, [cp_type_order_id, tipoPedido]);



  // seccion de servicios de roles
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [searchTermRoles, setSearchTermRoles] = useState('');
  const [cp_rol_name, setcp_rol_name] = useState('');
  const [cp_rol_description, setcp_rol_description] = useState('');
  const [cp_rol_status, setcp_rol_status] = useState('');
  const [editrolId, setEditrolId] = useState(null); // Add a state variable for editing
  const [isCheckedrol, setIsCheckedrol] = useState(false); // Estado inicial


  // consulta de roles
  useEffect(() => {
    ListRoles()
  }, [])

  const ListRoles = () => {
    RoleService.getAllRoles().then(response => {
      setRoles(response.data);
      console.log(response.data);
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

  //buscar rol por ID
  const ConsultarrolPorId = (rolid) => {
    RoleService.getrolById(rolid).then((response) => {
      setcp_rol_name(response.data.cp_rol_name);
      setcp_rol_description(response.data.cp_rol_description);
      setcp_rol_status(response.data.cp_rol_status);
      // Aquí establece el estado de los checkboxes en función del valor de cp_type_order_status
      if (response.data.cp_rol_status === "Activo") {
        setCheckbox_rol2(true); // Activo
        setCheckbox_rol1(false)
      } else {
        setCheckbox_rol2(false); // Inactivo
        setCheckbox_rol1(true)
      }
    }).catch(error => {
      console.log(error)
    })
  }
  //validacion de roles
  const [validatedRol, setValidatedRol] = useState(false);
  const handleSubmitRol = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      alert("Por favor, complete el formulario correctamente.");
    } else {
      saveOrUpdaterol();
    }
  };

  ///crear o actualizar rol
  const saveOrUpdaterol = (e) => {
    if (editrolId) {
      const existingType = users.find(item => item[0].cp_rol_id === editrolId)
      if (existingType) {
        const cp_estatus = (checkbox_rol2 ? "Activo" : checkbox_rol1 ? "Inactivo" : cp_estatus);
        if (cp_estatus == 'Inactivo') {
          alert("No se puede inactivar el rol hasta que actualice los usuarios que tengan el rol asignado")
        } else {
          // Update an existing record
          const cp_rol_status = (checkbox_rol2 ? "Activo" : checkbox_rol1 ? "Inactivo" : cp_rol_status);
          const Rol = { cp_rol_name, cp_rol_description, cp_rol_status };
          RoleService.updaterol(editrolId, Rol).then((response) => {
            console.log(response.data);
            const read = Cookies.get()
            UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
              console.log(responseid.data)
              const cp_id_user = responseid.data.cp_user_id;
              const cp_audit_description = "Actualizacion rol " + cp_rol_name + " " + cp_rol_description;
              const Audit = { cp_id_user, cp_audit_description };
              AuditService.CrearAudit(Audit).then((response) => {
                console.log(response.data);
                navigate('/GestionarUsuario');
                alert("Rol Actualizado Exitosamente");
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
            alert("Error al Actualizar Rol")
          });
        }
      } else {
        // Update an existing record
        const cp_rol_status = (checkbox_rol2 ? "Activo" : checkbox_rol1 ? "Inactivo" : cp_rol_status);
        const Rol = { cp_rol_name, cp_rol_description, cp_rol_status };
        RoleService.updaterol(editrolId, Rol).then((response) => {
          console.log(response.data);
          const read = Cookies.get()
          UserService.getUserByUsername(read.portal_sesion).then((responseid) => {
            console.log(responseid.data)
            const cp_id_user = responseid.data.cp_user_id;
            const cp_audit_description = "Actualizacion rol " + cp_rol_name + " " + cp_rol_description;
            const Audit = { cp_id_user, cp_audit_description };
            AuditService.CrearAudit(Audit).then((response) => {
              console.log(response.data);
              navigate('/GestionarUsuario');
              alert("Rol Actualizado Exitosamente");
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
          alert("Error al Actualizar Rol")
        });
      }
    } else {
      // Create a new record
      const existingType = roles.find(item => item.cp_rol_name === cp_rol_name || item.cp_rol_description === cp_rol_description);
      if (existingType) {
        alert("Ya existe un rol con la misma descripción.");
      } else {
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
            AuditService.CrearAudit(Audit).then((response) => {
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
        });
      }
    }
  }

  const bannerStyle = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    marginTop: '90px',/*31-10-2023*/
    maxHeight: '500px',/*31-10-2023*/
    overflow: 'auto', /*31-10-2023*/
  };

  const bannerStyle2 = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '1.6%', /*31-10-2023*/
    textAlign: 'center',
  };

  const bannerStyle3 = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '2%',
    textAlign: 'left',
  };

  const bannerStyle4 = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '13px',
    textAlign: 'center',
  };

  const bannerStyle5 = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    textAlign: 'center',
    marginTop: '-15px' /*31-10-2023 se ajusta margin top*/
  };

  const bannerStyle6 = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    textAlign: 'center',
    marginTop: '12px' //31-10-2023 se ajusta
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
    top: '33%', /*31-10-2023 se ajusta top*/
    left: '76.4%',  /*31-10-2023 se ajusta left*/
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
  const handleClose2 = () => {
    setShow2(false);
    setShow(true);
  }
  const handleShow2 = () => {
    setShow2(true);
    setShow(false);
  }

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => {
    setShow3(false);
    setShow(true);
  }
  const handleShow3 = () => {
    setShow3(true);
    setShow(false);
  }

  const [crtUserShow, crtUserSetShow] = useState(false);
  const handleCrtUserClose = () => crtUserSetShow(false);
  const handleCrtUserShow = () => crtUserSetShow(true);

  const [editShow, editSetShow] = useState(false);
  const handleEditClose = () => editSetShow(false);
  const handleEditShow = () => editSetShow(true);

  const handleEditClick = (id_user) => {
    handleEditShow(); // Show the edit modal
    setcp_User_Id(id_user);
    setEditUserId(id_user); // Set the typeOrderId for editing
    ListUsuarioActualizar(id_user); // Fetch data for editing
  };

  const [homeShow, homeSetShow] = useState(false);
  const handleHomeClose = () => homeSetShow(false);
  const handleHomeShow = () => homeSetShow(true);

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);


  const handleCheckbox1Change = (event) => {
    setCheckbox1(true);
    setCheckbox2(false);
  };
  const handleCheckbox2Change = (event) => {
    setCheckbox1(false);
    setCheckbox2(true);
    setIsChecked(event.target.checked);
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

  const [editShow2, editSetShow2] = useState(false);
  const handleEditClose2 = () => {
    editSetShow2(false);
    setShow(true);
  }
  const handleEditShow2 = (rolid) => {
    editSetShow2(true);
    setShow(false);
    setcp_Rol_Id(rolid);
    setEditrolId(rolid);
    ConsultarrolPorId(rolid);
  }
  const [checkbox_rol1, setCheckbox_rol1] = useState(false);
  const [checkbox_rol2, setCheckbox_rol2] = useState(false);

  const handleCheckbox_rol1 = (event) => {
    setCheckbox_rol1(true);
    setCheckbox_rol2(false);
  };
  const handleCheckbox_rol2 = (event) => {
    setCheckbox_rol1(false);
    setCheckbox_rol2(true);
    setIsCheckedrol(event.target.checked);
  };

  return (
    <>
      <div className='Back' style={backgroundStyle}>
        <Banner />
        {/*31-10-2023 se ajusta DIV completo*/}
        <div className='Datos_Aud' style={gestion_usua}>
          <table>
            <tbody>
              <tr>
                <td>
                  <div className='ubica_imagen_audit' >
                    <Container>
                      <Row>
                        <Col xs={6} md={4}>
                          <Image className='Img-Admin-audit' src={imagenes.Arboles} roundedCircle />
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </td>
                <td>
                  <div className='ubica_datos_audit'>
                    <table>
                      <tbody>
                        <tr>
                          <th className='Datos' style={{ fontFamily: 'Bold', fontSize: '14px' }}>{usuarioSesion}</th>
                        </tr>
                        <tr>
                          <td className='Datos' style={{ fontFamily: 'Ligera', fontSize: '14px' }}>{usuarioCorreo}</td>
                        </tr>
                        <tr>
                          <td className='Datos' style={{ fontFamily: 'Ligera', fontSize: '14px' }}>{usuariotelefono}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*31-10-2023 se ajusta DIV completo*/}

        <Dropdown style={dropDown}>
          <Dropdown.Toggle style={dropDownbackgroundStyle} id="dropdown-basic">
            {selectedOption}
          </Dropdown.Toggle>
          <Dropdown.Menu style={dropDownbackgroundStyle}>
            <Dropdown.Item onClick={() => { setSelectedOption('Auditoria'); navigate("/Auditoria"); }}>Auditoría</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Consecutivos'); navigate("/GestionarConsecutivos"); }}>Gestionar Consecutivos</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Iva'); navigate("/DataIva"); }}>Gestionar Iva</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Promesas'); navigate("/Promesas"); }}>Gestionar Promesas</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Tipo De Pedidos'); navigate("/Pedidos"); }}>Gestionar Tipo De Pedidos</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Gestionar Usuarios'); navigate("/GestionarUsuario"); }}>Gestionar Usuarios</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Notificaciones'); navigate("/Notificaciones"); }}>Notificaciones</Dropdown.Item>
            <Dropdown.Item onClick={() => { setSelectedOption('Organización de Inventarios'); navigate("/Inventario"); }}>Organización De Inventarios</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className='busc_gest_usua'>
          <Form inline>
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Buscar"
                  className=" mr-sm-2"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button className='usuario'><FaSearch /></Button> {/*20-10-2023*/}
              </Col>
            </Row>
          </Form>
        </div>
        <div className='DataTable_Usu' style={bannerStyle} >  {/*31-10-2023 ajuste classname*/}
          <th style={gestion}>GESTIÓN DE USUARIO </th>
          <table className='table table-bordered' style={bannerStyle6} >
            <thead style={bannerStyle}>
              <tr style={bannerStyle} className='borderless_gest_usua'>
                <th style={bannerStyle} className='borderless_gest_usua'>Cliente</th>
                <th style={bannerStyle}>Nombre</th>
                <th style={bannerStyle}>Teléfono</th>
                <th style={bannerStyle}>Correo</th>
                <th style={bannerStyle}>Estado</th>
                <th style={bannerStyle}>Rol</th>
                <th style={bannerStyle} className='borderless_gest_usua'>Acciones</th>
              </tr>
            </thead>
            <tbody style={bannerStyle}>
              {filterUsuario()
                .toSorted((a, b) => a[0].cp_user_id - b[0].cp_user_id) // Ordena el arreglo por cp_user_id en orden ascendente
                .map((users) => (
                  <tr style={bannerStyle} className='borderless_gest_usua' key={users[0].cp_user_id}>
                    <td style={bannerStyle}>{users[0].cust_name}</td>
                    <td style={bannerStyle}>{users[0].cp_name}</td>
                    <td style={bannerStyle}>{users[0].cp_cell_phone}</td>
                    <td style={bannerStyle}>{users[0].cp_email}</td>
                    <td style={bannerStyle}>{users[0].cp_estatus}</td>
                    <td style={bannerStyle}>{users[1].cp_rol_name}</td>
                    <td style={bannerStyle4}>
                      <Button onClick={() => handleEditClick(users[0].cp_user_id)} className='edit-btn'>
                        <FaRegEdit />
                      </Button>
                    </td>
                    <td style={bannerStyle4}>
                      <Button onClick={() => { handleHomeShow(); ListDirecciones(users[0].cust_account_id); }} className='home-btn'>
                        <FaHome />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='Botones_gest mt-12'> {/*31-10-2023 cambiar classname*/}
          <button onClick={handleShow} className='btns p-2 m-2 btn-sm'>Gestionar Roles</button>
          <button onClick={handleCrtUserShow} className='btns p-2 m-2 btn-sm'>Crear usuario</button>
        </div>




        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header className="Gestion_roles" closeButton>
            <Modal.Title><FaStar className='btn_faStar_usua' /> GESTIONAR ROLES</Modal.Title>
          </Modal.Header>
          <Modal.Body className="Gestion_roles">
            <Form>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput1">
                <div>
                  <table className='table table-bordered' style={bannerStyle5} >
                    <thead>
                      <tr className='bordered_usua' style={bannerStyle} >
                        <th className='bordered_usua' style={bannerStyle}>Nombre</th>
                        <th className='bordered_usua' style={bannerStyle}>Descripción Rol</th>
                        <th className='bordered_usua' style={bannerStyle}>Estado</th>
                        <th className='bordered_usua' style={bannerStyle}>Acciones</th>
                        <th className='bordered_usua' style={bannerStyle}></th>
                      </tr>
                    </thead>

                    <tbody >
                      {roles
                        .toSorted((a, b) => a.cp_rol_id - b.cp_rol_id) // Ordena el arreglo por cp_rol_id en orden ascendente
                        .map((roles) => (
                          <tr className='bordered_usua' style={bannerStyle} key={roles.cp_rol_id}>
                            <td style={bannerStyle}>{roles.cp_rol_name}</td>
                            <td style={bannerStyle}>{roles.cp_rol_description}</td>
                            <td style={bannerStyle}>{roles.cp_rol_status}</td>
                            <td style={bannerStyle2}>
                              <Button onClick={() => handleEditShow2(roles.cp_rol_id)} className='Edit-estado-ges-rol'>
                                <FaRegEdit />
                              </Button>
                            </td>
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
            <Button className="boton_ges_usua " onClick={handleShow2}>Crear Rol</Button>  {/*31-10-2023 se quita p1*/}
          </Modal.Footer>
        </Modal>




        <Modal show={show2} onHide={handleClose2}>
          <Modal.Header className='Create-Rol' closeButton>
            <Modal.Title><FaStar className='btn_faStar1_usua' /> ROL</Modal.Title>
          </Modal.Header>
          <Modal.Body className='Create-Rol'>
            <Form noValidate validated={validatedRol} onSubmit={handleSubmitRol}>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput1">
                <Form.Label><th>CREAR ROL</th></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre Rol"
                  autoFocus
                  value={cp_rol_name}
                  onChange={(e) => setcp_rol_name(e.target.value)}
                  required // Hacer que este campo sea obligatorio
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa el nombre del rol</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput1">
                <Form.Control
                  type="text"
                  placeholder="Descripción"
                  autoFocus
                  value={cp_rol_description}
                  onChange={(e) => setcp_rol_description(e.target.value)}
                  required // Hacer que este campo sea obligatorio
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa la Descripción del rol</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Modal.Footer className='Create-Rol'>
                <Button className="boton_crear_rol" type='submit'> Crear</Button> {/*31-10-2023 se ajusta p-2 m-2*/}
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>





        <Modal show={show3} onHide={handleClose3}>
          <Modal.Header className="Contexto" closeButton>
          </Modal.Header>
          <Modal.Body className="Contexto">
            <Form>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput1">
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
            <Button className="Btn_guardar_context " > {/*31-10-2023*/}
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>




        <Modal show={crtUserShow} onHide={handleCrtUserClose}>
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title ><FaUser className='btn_fauser_usua' /> CREAR USUARIO</Modal.Title>
          </Modal.Header>
          <Modal.Body className='Create-User' >
            <Form noValidate validated={validated} onSubmit={handleSubmit} >
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput1">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de usuario"
                  autoFocus
                  value={cp_name}
                  onChange={(e) => setcp_Name(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa el nombre de usuario</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput2" disabled>
                <Form.Label>Correo Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Correo Usuario"
                  autoFocus
                  value={cp_email}
                  onChange={(e) => setcp_Email(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa el correo de usuario</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Teléfono"
                  autoFocus
                  value={cp_cell_phone}
                  onChange={(e) => setCp_Cell_Phone(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa el teléfono de usuario</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput4">
                <Form.Label>Nombre cliente</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlid="exampleForm.ControlInput4" id="dropdown-basic">
                    {selectedCliente ? selectedCliente.accountName : 'Seleccionar Cliente'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form.Control
                      type="text"
                      placeholder="Buscar Cliente"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      required
                    />
                    {filteredClientes.map((cliente) => (
                      <Dropdown.Item
                        key={cliente.custAccountId}
                        onClick={() => handleClienteSelect(cliente)}                     >
                        {cliente.accountName}
                      </Dropdown.Item>
                    ))}
                    <Form.Control.Feedback type="invalid">Por favor ingresa el cliente asociado</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput5">
                <Form.Label >ROL</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlid="exampleForm.ControlInput5" id="dropdown-basic">
                    {selectedRoles ? selectedRoles.cp_rol_name : 'Seleccionar Rol'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form.Control
                      type="text"
                      placeholder="Buscar rol"
                      value={searchTermRoles}
                      onChange={handleSearchChangeRoles}
                      required
                    />
                    {filteredRoles.map((rolUser) => (
                      <Dropdown.Item
                        key={rolUser.cp_rol_id}
                        onClick={() => handleRolesSelect(rolUser)}                     >
                        {rolUser.cp_rol_name}
                      </Dropdown.Item>
                    ))}
                    <Form.Control.Feedback type="invalid">Por favor ingresa el rol</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              {/*AJUSTE 31-10-2023 INICIO*/}
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput5">
                <Form.Label>Tipo de Pedido</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlid="exampleForm.ControlInput5" id="dropdown-basic">
                    {selectedTipoPedido ? selectedTipoPedido.cp_type_order_description : 'Seleccionar'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form.Control
                      type="text"
                      placeholder="Buscar"
                      value={searchTermTipoPedido}
                      onChange={handleSearchChangeTipoPedido}
                      required
                    />
                    {filteredTipoPedido.map((Pedido) => (
                      <Dropdown.Item
                        key={Pedido.cp_type_order_id}
                        onClick={() => handleTipoPedidoSelect(Pedido)}                     >
                        {Pedido.cp_type_order_description}
                      </Dropdown.Item>
                    ))}
                    <Form.Control.Feedback type="invalid">Por favor ingresa el tipo de pedido</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              {/*AJUSTE 31-10-2023 fin*/}
              <Modal.Footer className='Create-User' >
                <Button className='Crear-btn-usua' type='submit' >
                  Crear
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>




        <Modal show={editShow} onHide={handleEditClose}>
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title><FaRegEdit className='btn_faregedit_usua' /> MODIFICAR DATOS</Modal.Title>
          </Modal.Header>
          <Modal.Body style={bannerStyle3} className='Edit-User'>
            <Form noValidate validated={validated} onSubmit={handleSubmit} > {/*AJUSTE LCPG 9-10*/}
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de Usuario"
                  autoFocus
                  value={cp_name}
                  onChange={(e) => setcp_Name(e.target.value)}
                  required /*AJUSTE LCPG 9-10*/
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa el Nombre de usuario</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                <Form.Label>Correo de Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Correo de Usuario" /*AJUSTE LCPG 9-10*/
                  autoFocus
                  value={cp_email}
                  onChange={(e) => setcp_Email(e.target.value)}
                  required /*AJUSTE LCPG 9-10*/
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa el Correo de usuario</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Teléfono" /*AJUSTE LCPG 9-10*/
                  autoFocus
                  value={cp_cell_phone}
                  onChange={(e) => setCp_Cell_Phone(e.target.value)}
                  required /*AJUSTE LCPG 9-10*/
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa el Teléfono de usuario</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Label>Nombre de Cliente</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlId="exampleForm.ControlInput4" id="dropdown-basic">
                    {selectedCliente ? selectedCliente.accountName : set_Cust_Name ? cust_name : ''}
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
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
                <Form.Label>ROL</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlId="exampleForm.ControlInput5" id="dropdown-basic">
                    {selectedRoles ? selectedRoles.cp_rol_name : setcp_Rol_Id ? usernameRol[cp_rol_id] ? (<span>{usernameRol[cp_rol_id]}</span>) : (<span>Cargando...</span>) : ''}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form.Control
                      type="text"
                      placeholder="Buscar Rol"
                      value={searchTermRoles}
                      onChange={handleSearchChangeRoles}
                      required /*AJUSTE LCPG 9-10*/
                    />
                    {filteredRoles.map((rolUser) => (
                      <Dropdown.Item
                        key={rolUser.cp_rol_id}
                        onClick={() => handleRolesSelect(rolUser)}                     >
                        {rolUser.cp_rol_name}
                      </Dropdown.Item>
                    ))}
                    <Form.Control.Feedback type="invalid">Por favor selecciona el Rol de usuario</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              {/*AJUSTE 31-10-2023 INICIO*/}
              <Form.Group className="mb-3" controlid="exampleForm.ControlInput5">
                <Form.Label>Tipo de Pedido</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle className="menu mb-3" style={{ color: 'black' }} controlid="exampleForm.ControlInput5" id="dropdown-basic">
                    {selectedTipoPedido ? selectedTipoPedido.cp_type_order_description : setcp_type_order_id ? descripcionTipoPedido : ''}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Form.Control
                      type="text"
                      placeholder="Buscar"
                      value={searchTermTipoPedido}
                      onChange={handleSearchChangeTipoPedido}
                      required
                    />
                    {filteredTipoPedido.map((Pedido) => (
                      <Dropdown.Item
                        key={Pedido.cp_type_order_id}
                        onClick={() => handleTipoPedidoSelect(Pedido)}                     >
                        {Pedido.cp_type_order_description}
                      </Dropdown.Item>
                    ))}
                    <Form.Control.Feedback type="invalid">Por favor ingresa el tipo de pedido</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              {/*AJUSTE 31-10-2023 fin*/}
              <div className='CheckBox'> {/*AJUSTE LCPG INICIO*/}
                <Form className='CheckBox'>

                  <Form.Group className='Checkbox_estado'>
                    <Form.Check type="checkbox">
                      <Form.Check.Label>Inactivo</Form.Check.Label>
                      <Form.Check.Input checked={checkbox1} onChange={handleCheckbox1Change}
                      />
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
              {/*AJUSTE LCPG 9-10 cambio ubicación footer*/}
              <Modal.Footer className='Create-User'>
                <Button type="submit" className='Guardar-btn-usua' > {/*se cambia nombre classname 31-10-2023*/}
                  Guardar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>




        <Modal size="lg"
          show={homeShow} onHide={handleHomeClose} aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title><FaHome className='btn_fahome_usua' /> GESTIONAR DIRECCIONES</Modal.Title>
          </Modal.Header>
          <ModalBody className='Create-User'>
            <div>
              <table className='table table-borderless'>
                <thead >
                  <tr >
                    <th >Dirección</th>
                    <th >Dpt</th>
                    <th >Ciudad</th>
                    <th >País</th>
                    <th >Vendedor</th>
                  </tr>
                </thead>
                <tbody >
                  {direcciones
                    .toSorted((a, b) => a.siteUseId - b.siteUseId) // Ordena el arreglo por cp_rol_id en orden ascendente
                    .map((direcciones) => (
                      <tr key={direcciones.siteUseId}>
                        <td >{direcciones.address1}</td>
                        <td >{direcciones.state}</td>
                        <td >{direcciones.city}</td>
                        <td >{direcciones.country}</td>
                        <td >{direcciones.nameVendedor}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
          <Modal.Footer className='Create-User' >
          </Modal.Footer>
        </Modal>



        <Modal show={editShow2} onHide={handleEditClose2}>
          <Modal.Header className='Create-User' closeButton>
            <Modal.Title><FaRegEdit className='btn_faregedit_usua' /> MODIFICAR DATOS</Modal.Title>
          </Modal.Header>
          <Modal.Body style={bannerStyle3} >
            <Form noValidate validated={validatedRol} onSubmit={handleSubmitRol}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre Rol"
                  autoFocus
                  disabled
                  value={cp_rol_name}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" disabled>
                <Form.Label>Descripción Rol</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Descripción Rol"
                  autoFocus
                  value={cp_rol_description}
                  onChange={(e) => setcp_rol_description(e.target.value)}
                  required // Hacer que este campo sea obligatorio
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa la descripcon del Rol</Form.Control.Feedback> {/*AJUSTE LCPG 9-10*/}
              </Form.Group>
              <Form className='CheckBox_estado_rol'>
                <div className='CheckBox_2'> {/*AJUSTE 31-10-2023*/}
                  <Form className='CheckBox_2'> {/*AJUSTE 31-10-2023*/}
                    <Form.Group className='Checkbox_estado'>
                      <Form.Check type="checkbox">
                        <Form.Check.Label>Inactivo</Form.Check.Label>
                        <Form.Check.Input checked={checkbox_rol1} onChange={handleCheckbox_rol1}
                        />
                      </Form.Check>
                    </Form.Group>
                    <Form.Group className='Checkbox_estado'>
                      <Form.Check type="checkbox">
                        <Form.Check.Label>Activo</Form.Check.Label>
                        <Form.Check.Input checked={checkbox_rol2} onChange={handleCheckbox_rol2} />
                      </Form.Check>
                    </Form.Group>
                  </Form>
                </div> {/*AJUSTE LCPG FIN*/}
              </Form>
              <Modal.Footer className='Create-User'>
                <Button className='Save-btn-usua' type='submit'>
                  Guardar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
        <Image className='Img_gest_usuario' src={imagenes.Creamos} />
      </div >
    </>

  );

};
export default DataTable;