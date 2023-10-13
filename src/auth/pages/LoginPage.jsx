import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import '../pages/LoginPage.css';
import { Form, Button } from 'react-bootstrap';
import imagenes from '../../assets/imagenes';
import LoginService from '../../services/LoginService';
import AuditService from '../../services/AuditService'
import UserService from "../../services/UserService";
import RoleService from "../../services/RoleService";
import { BrowserRouter as Routes, Route, Link } from 'react-router-dom'; {/*AJUSTE LCPG 10-10*/ }

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginUser = () => {
    LoginService.postLoginUser(username, password).then((response) => {
      console.log(response.data);
      if (response.data == "usuario o contraseña incorrectos") {
        LoginService.logout();
        alert("usuario o contraseña incorrectos");
        navigate('/login')
      } else {
        const cp_id_user = response.data.substr(7, 100);
        const cp_audit_description = "Login Usuario " + username;
        const Audit = { cp_id_user, cp_audit_description };
        AuditService.CrearAudit(Audit).then((Response) => {
          console.log(response.data);
          UserService.getUserById(cp_id_user).then((responseuser) => {
            console.log(responseuser.data);
            RoleService.getrolById(responseuser.data.cp_rol_id).then((responserol) => {
              console.log(responserol.data);
              if (responseuser.data.cp_estatus == "Activo" & responserol.data.cp_rol_name == "Administrador" & responserol.data.cp_rol_status == "Activo") {
                navigate('/Dropdown');
              } else {
                alert("Aun no tiene Accesos o el rol esta inactivo");
              }
            }).catch(error => {
              console.log(error)
            })
          }).catch(error => {
            console.log(error)
          })



        }).catch(error => {
          console.log(error)
        })
      }
    }).catch(error => {
      console.log(error)
    })
  }

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
                placeholder='correo@ejemplo.com' value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className='password-form mb-3'
              controlId='formBasicPassword'>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type='password'
                placeholder='Ingresa Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            {/*AJUSTE LCPG 10-10 INI*/}
            <td className='Actua_contra'><Link to='/ConfirmarCorreo'>¿Has olvidado tu contraseña?</Link></td>
            {/*AJUSTE LCPG 10-10 FIN*/}
            <Button onClick={(e) => loginUser(e)} className='Login-btn'>
              Ingresa
            </Button>
          </Form>
        </div>
      </div >
    </div >
  )
}

export default LoginPage

