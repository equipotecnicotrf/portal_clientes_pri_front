import React, { useEffect, useState } from 'react'

import '../pages/LoginPage.css';

import { Form, Button } from 'react-bootstrap';

import imagenes from '../../assets/imagenes';

import { Link, useNavigate, useParams } from 'react-router-dom';

import LoginService from '../../services/LoginService';

import AuditService from '../../services/AuditService'

 

const LoginPage = () => {

    const [username,setUsername] = useState('');

    const [password,setPassword] = useState('');

    const navigate = useNavigate();    

 

    const loginUser = () => {

      LoginService.postLoginUser(username,password).then((response) => {

        console.log(response.data);  

        if (response.data == "usuario o contraseña incorrectos"){

          alert("usuario o contraseña incorrectos");

          navigate('/login')

        }else{

          const cp_id_user = response.data.substr(7,100);

          const cp_audit_description = "Login Usuario "+username;

          const Audit = {cp_id_user, cp_audit_description};

 

          AuditService.CrearAudit(Audit).then((Response) => {

            console.log(response.data);

            navigate('/Homepage');

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

 

        <img src={imagenes.LogoRojo}/>

        </div>

        <div className='Login-content justify-content-center aling-items-center'>

        <Form className='rounded p-4 p-sm-3'>

        <Form.Group className='email-form mb-3' controlId='formBasicEmail'>

          <Form.Label>Email</Form.Label>

          <Form.Control type='email' placeholder='correo@ejemplo.com' value={username} onChange={(e) => setUsername(e.target.value) }/>

        </Form.Group>

        <Form.Group className='password-form mb-3' controlId='formBasicPassword'>

            <Form.Label>Contraseña</Form.Label>

            <Form.Control type='password' placeholder='Ingresa Contraseña' value= {password} onChange={(e) => setPassword(e.target.value) }/>

          </Form.Group>

          <Button className='Login-btn' onClick={(e) => loginUser(e)}> Ingresa </Button>

  </Form>

 

        </div>

     

 

      </div>

     

    </div>

  )

}

 

export default LoginPage

 