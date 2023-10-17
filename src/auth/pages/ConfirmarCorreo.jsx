import React, { useState } from 'react';
import '../pages/ConfirmarCorreo.css';
import imagenes from '../../assets/imagenes';
import { Form, Button } from 'react-bootstrap';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import EmailService from '../../services/EmailService';

const ConfirmarCorreo = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const usernamemail = (username) => {
        UserService.getUserByUsername(username).then((response) => {
            if (response.data.username === username) {
                const toUser = [username];
                const subject = "Restablecimiento de contraseña Portal Clientes Primadera";
                const resetPasswordLink = `http://150.136.119.119:83/ActualizarContrasena/?userId=${response.data.cp_user_id}`;
                const message = `Hola ${response.data.cp_name},\n\n`
                    + "Recibes este correo porque solicitaste un restablecimiento de contraseña para tu cuenta en el Portal De clientes Primadera.\n\n"
                    + `Por favor, [clic aquí](${resetPasswordLink}) para cambiar tu contraseña.\n\n`
                    + "Si no solicitaste este restablecimiento de contraseña, puedes ignorar este mensaje.\n\n"
                    + "Gracias,\n"
                    + "Equipo Primadera";

                const correo = { toUser, subject, message };
                EmailService.Sendmessage(correo).then(() => {
                    console.log("Correo enviado correctamente");
                    alert("Mensaje Enviado");
                    navigate('/login');
                    window.location.reload();
                }).catch(error => {
                    console.log(error);
                    alert("Error al enviar correo");
                });
            } else {
                alert("No existe usuario con el correo diligenciado");
            }
        }).catch(error => {
            console.log(error);
            alert("No existe usuario con el correo diligenciado");
        });
    };

    return (
        <div className='BackImg_conf_correo'>
            <div className='conf_correo_head p-4 p-sm-3 justify-content-center aling-items-center'>
                <div className='logo-rojo_conf_correo p-4 p-sm-3 justify-content-center aling-items-center'>
                    <img src={imagenes.LogoRojo} alt="Logo" />
                </div>
                <div className='conf_correo_content justify-content-center aling-items-center'>
                    <Form className='rounded p-4 p-sm-3'>
                        <tr><Form.Label><th>Restablecer Contraseña</th></Form.Label></tr>
                        <tr><Form.Text>Ingrese la dirección de correo electrónico verificada de su cuenta de usuario y le enviaremos un enlace para restablecer su contraseña.</Form.Text></tr>
                        <Form.Group className='email-form-conf mb-3' controlId='formBasicEmail'>
                            <Form.Control
                                type='email'
                                placeholder='correo@ejemplo.com'
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Button className='Confirmacion-btn' onClick={() => usernamemail(username)}>
                            Enviar correo electrónico
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarCorreo;