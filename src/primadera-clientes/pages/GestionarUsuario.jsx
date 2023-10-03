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



const DataTable = ({ backgroundColor }) => {
  const bannerStyle = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',

  };
  const backgroundStyle = {
    backgroundImage: `url(${imagenes.fondoTextura}`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Altura de la pantalla completa
  };

  const data = [
    {
      Cliente: 1, Nombre: 'John Doe', Telefono: 358454, correo: 'dshfkjr@bf.com',
      estado: 'Activo', rol: 'Admin'
    }

  ];

  const data_rol = [

    { name: 'John Doe', descripcion_rol: 'Creación pedidos', estado: 'Activo' },

    { name: 'Jane Doe', descripcion_rol: 'Creación orden', estado: 'Inactivo' }

  ];

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

  const handleCheckboxCon1Change = () => {
    setCheckbox1(false);
    setCheckbox2(true);
  };
  const handleCheckboxCon2Change = () => {
    setCheckbox1(false);
    setCheckbox2(true);
  };
  const handleCheckboxCon3Change = () => {
    setCheckbox1(false);
    setCheckbox2(true);
  };


  return (
    <>
      <div className='Back' style={backgroundStyle}>
        <Banner />

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
                <tr style={bannerStyle} key={item.Cliente}>
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
          <button onClick={handleShow} className='btn1 p-2 btn-sm'>Gestionar Roles</button>
          <button onClick={handleCrtUserShow} className='btn2 p-2 m-2 btn-sm'>Crear usuario</button>
        </div>
      

      <Modal show={show} onHide={handleClose}>
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
            <Button className="Btn_crear" >
              Crear
            </Button>
            <Button className="Btn_rol" onClick={handleShow2} onClose={handleClose}>
              Gestionar Rol
            </Button>
          </Form>

        </Modal.Body>
        <Modal.Footer className='Create-Rol'>
        </Modal.Footer>
      </Modal>



      <Modal size="lg" show={show2} onHide={handleClose2}>
        <Modal.Header className="Gestion_roles">
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
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.descripcion_rol}</td>
                        <td>{item.estado}</td>
                        <td><Button className="Btn_contexto" onClick={handleShow3} onClose={handleClose2}>
                          Contexto
                        </Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button className="Btn_cerrar" onClick={handleClose2}>
                Cerrar
              </Button>
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer className="Gestion_roles">
        </Modal.Footer>
      </Modal>


      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header className="Contexto">
        </Modal.Header>
        <Modal.Body className="Contexto">
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label><th>CONTEXTO</th></Form.Label>
            </Form.Group>
            <div className='CheckBox'>
              <label>
                <input
                  type="checkbox"
                  checked={checkbox1}
                  onChange={handleCheckboxCon1Change}
                />
                Crear Pedido
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={checkbox2}
                  onChange={handleCheckboxCon2Change}
                />
                Consultar Pedido
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={checkbox2}
                  onChange={handleCheckboxCon3Change}
                />
                Crear pedido sobre inventario
              </label>
            </div>

            <Button className="Btn_guardar_context" onClick={handleClose3}>
              Guardar
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="Contexto">
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
              <Dropdown>
                <Dropdown.Toggle className="menu mb-3" controlId="exampleForm.ControlInput4" id="dropdown-basic">
                  Seleccionar Cliente
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item >Cliente 1</Dropdown.Item>
                  <Dropdown.Item >Cliente 2</Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label >ROL</Form.Label>
              <Dropdown>
                <Dropdown.Toggle className="menu mb-3" controlId="exampleForm.ControlInput4" id="dropdown-basic">
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
                <Dropdown.Toggle className="menu mb-3" controlId="exampleForm.ControlInput5" id="dropdown-basic">
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
                <Dropdown.Toggle className="menu mb-3" controlId="exampleForm.ControlInput7" id="dropdown-basic">
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


          <div >
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
                  <tr key={item.Cliente}>
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
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>

  );

};
export default DataTable;
