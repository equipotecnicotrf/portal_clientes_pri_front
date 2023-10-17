import axios from "axios";

const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Users";
const USERNAME_BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Username";

//const BASE_REST_API_URL = "http://localhost:8285/api/v1/Users";
//const USERNAME_BASE_REST_API_URL = "http://localhost:8285/api/v1/Username";

class UserService {
    getAllUsers() {
        return axios.get(BASE_REST_API_URL);
    }

    createUsers(user) {
        return axios.post(BASE_REST_API_URL, user);
    }

    getUserById(userId) {
        return axios.get(BASE_REST_API_URL + '/' + userId);
    }

    getUserByUsername(username) {
        return axios.get(USERNAME_BASE_REST_API_URL + "?username=" + username);
    }

    updateUser(userId, user) {
        return axios.put(BASE_REST_API_URL + '/' + userId, user);
    }

    updatePassword(userId, newPassword) {
        return axios.put(BASE_REST_API_URL + '/' + userId + '/update-password', { cp_Password: newPassword });
    }

    //http://localhost:83/ActualizarContraseña/?userId=5 => Ejemplo URL para cambio de contraseña

}

export default new UserService();