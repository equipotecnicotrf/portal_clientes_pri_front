import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8081/api/v1/Roles";

class RoleService{
    getAllRoles(){
        return axios.get(BASE_REST_API_URL);
    }

    createRoles(rol){
        return axios.post(BASE_REST_API_URL,rol);
    }

    getrolById(rolId){
        return axios.get(BASE_REST_API_URL + '/' + rolId);
    }

    updateCliente(rolId,rol){
        return axios.put(BASE_REST_API_URL + '/' + rolId,rol);
    }

}
export default new RoleService();