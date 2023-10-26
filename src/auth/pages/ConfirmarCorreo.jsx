import React, { useState } from 'react';
import '../pages/ConfirmarCorreo.css';
import imagenes from '../../assets/imagenes';
import { Form, Button } from 'react-bootstrap';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import EmailService from '../../services/EmailService';
import NotificationService from '../../services/NotificationService';

const ConfirmarCorreo = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const usernamemail = (username) => {
        UserService.getUserByUsername(username).then((response) => {
            if (response.data.username === username) {
                const toUser = [username];
                const context = "Olvido Contraseña";
                NotificationService.getNotificationsContext(context).then((notificatioresponse) => {
                    const subject = notificatioresponse.data[0].cp_Notification_name;
                    const resetPasswordLink = `http://150.136.119.119:83/ActualizarPassword/?userId=${response.data.cp_user_id}`;
                    const notificationMessage = notificatioresponse.data[0].cp_Notification_message;
                    const message = notificationMessage
                        .replace('${nombreusuario}', response.data.cp_name)
                        .replace('${resetPasswordLink}', resetPasswordLink);
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

                }).catch(error => {
                    console.log(error);
                    alert("Error obtener contexto de notificacion");
                })


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