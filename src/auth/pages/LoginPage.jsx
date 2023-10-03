import { useNavigate } from "react-router-dom";
import '../pages/LoginPage.css';
import { Form, Button } from 'react-bootstrap';
import imagenes from '../../assets/imagenes';


const LoginPage = () => {

  const navigate = useNavigate();

  return (
    <div className='BackImg'>
      <div className='Login-head p-4 p-sm-3 justify-content-center
      aling-items-center'>
        <div className='logo-rojo p-4 p-sm-3 justify-content-center
        aling-items-center' >
          <img src={imagenes.LogoRojo} />
        </div>
        <div className='Login-content justify-content-center aling-items-center'>
          <Form className='rounded p-4 p-sm-3'>
            <Form.Group className='email-form mb-3'
              controlId='formBasicEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email'
                placeholder='correo@ejemplo.com' />
            </Form.Group>
            <Form.Group className='password-form mb-3'
              controlId='formBasicPassword'>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type='password'
                placeholder='Ingresa Contraseña' />
            </Form.Group>
            <Button onClick={() => navigate("/Dropdown")} className='Login-btn'>

              Ingresa

            </Button>
          </Form>
        </div>
      </div>
    </div>

  )

}
export default LoginPage
