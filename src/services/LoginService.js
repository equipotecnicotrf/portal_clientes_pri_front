import axios from "axios";
import Cookies from 'js-cookie';

const BASE_REST_API_URL = "http://localhost:8081/api/v1/login";
const COOKIE_NAME = 'portal_sesion';

class LoginUser {
  postLoginUser(username, password) {
    Cookies.set(COOKIE_NAME, username, { expires: 0.1 }); // Configura una cookie para el token
    return axios.post(BASE_REST_API_URL+"?username="+username+"&password="+password);    
  }

  logout = () => {
    Cookies.remove(COOKIE_NAME); // Elimina la cookie del token al cerrar sesión
  };
  
  isAuthenticated = () => {
    return !!Cookies.get(COOKIE_NAME); // Verifica si el usuario está autenticado
  };
    

}

 

export default new LoginUser();
