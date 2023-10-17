import React, { useEffect, useState } from 'react';
import '../pages/ActualizarContraseña.css';
import imagenes from '../../assets/imagenes';
import { Form, Button } from 'react-bootstrap';
import UserService from '../../services/UserService';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';

const ActualizarPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get('userId');
  const [password, setPassword] = useState({
    CP_Password: '', // Estructura userEntity
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [userStartedTyping, setUserStartedTyping] = useState(false);

  const isButtonDisabled = () => {
    return (
      !hasUpperCase ||
      !hasNumber ||
      !hasSpecialChar ||
      password.CP_Password !== confirmPassword ||
      password.CP_Password.length < 8
    );
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword({
      ...password,
      CP_Password: newPassword,
    });

    if (newPassword) {
      setHasUpperCase(/[A-Z]/.test(newPassword));
      setHasNumber(/\d/.test(newPassword));
      setHasSpecialChar(/[!@#$%^&*]/.test(newPassword));
      setUserStartedTyping(true);
    } else {
      setHasUpperCase(false);
      setHasNumber(false);
      setHasSpecialChar(false);
      setUserStartedTyping(false);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
  };

  const handleUpdatePassword = () => {
    if (password.CP_Password && confirmPassword && password.CP_Password === confirmPassword) {
      if (password.CP_Password.length >= 8) {
        UserService.updatePassword(userId, password.CP_Password).then((response) => {
          if (response.data === "El usuario con este ID no existe : ") {
            alert("No se encontró el usuario");
          } else {
            alert("¡Actualización exitosa!");
            navigate('/login');
            window.location.reload();
          }
          console.log('Contraseña actualizada correctamente');
          navigate('/login');
          window.location.reload();
        }).catch((error) => {
          console.error('Error al actualizar la contraseña', error);
        });
      } else {
        alert('La contraseña debe tener al menos 8 caracteres.');
      }
    } else {
      console.error('Las contraseñas no coinciden o están incompletas');
    }
  };

  return (
    <div className='BackImg_actua_contra'>
      <div className='Actua_contra-head p-4 p-sm-3 justify-content-center aling-items-center'>
        <div className='logo-rojo_actua_contra p-4 p-sm-3 justify-content-center aling-items-center'>
          <img src={imagenes.LogoRojo} alt='Logo' />
        </div>
        <div className='Actua_contra_content justify-content-center aling-items-center'>
          <Form className='rounded p-4 p-sm-3'>
            <Form.Label>
              <th>Confirmación de Contraseña</th>
            </Form.Label>
            <Form.Group className='email-form mb-3' controlId='formBasicEmail'>
              <Form.Label>Contraseña nueva</Form.Label>
              <Form.Control
                type='password'
                placeholder='Contraseña nueva'
                value={password.CP_Password}
                onChange={handlePasswordChange}
              />
              {userStartedTyping && (
                <div>
                  {!hasUpperCase && <p>Debe contener al menos una letra mayúscula.</p>}
                  {!hasNumber && <p>Debe contener al menos un número.</p>}
                  {!hasSpecialChar && <p>Debe contener al menos un carácter especial, evite usar el caracter +.</p>}
                </div>
              )}
            </Form.Group>
            <Form.Group className='password-form mb-3' controlId='formBasicPassword'>
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirmar contraseña'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </Form.Group>
            <Button className='Actualizar-btn' onClick={handleUpdatePassword} disabled={isButtonDisabled()}>
              Actualizar
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ActualizarPassword;
