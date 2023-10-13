import React, { useEffect, useState } from 'react'
import '../pages/ConfirmarCorreo.css';
import imagenes from '../../assets/imagenes';
import { Form, Button } from 'react-bootstrap';

const ConfirmarCorreo = () => {
    return (
        <div className='BackImg_conf_correo'>
            <div className='conf_correo_head p-4 p-sm-3 justify-content-center
              aling-items-center'>
                <div className='logo-rojo_conf_correo p-4 p-sm-3 justify-content-center
              aling-items-center' >
                    <img src={imagenes.LogoRojo} />
                </div>
                <div className='conf_correo_content justify-content-center aling-items-center'>
                    <Form className='rounded p-4 p-sm-3'>

                        <tr><Form.Label><th>Restablecer Contraseña</th></Form.Label></tr>
                        <tr><Form.Text>Ingrese la dirección de correo electrónico verificada de su cuenta de usuario y le enviaremos un enlace para restablecer su contraseña.</Form.Text></tr>
                        <Form.Group className='email-form-conf mb-3'
                            controlId='formBasicEmail'>
                            <Form.Control type='email'
                                placeholder='correo@ejemplo.com' />
                        </Form.Group>
                        <Button className='Confirmacion-btn'>
                            Enviar correo electrónico
                        </Button>
                        
                    </Form>
                </div>
            </div >
        </div >)

}

export default ConfirmarCorreo;