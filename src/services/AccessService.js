import axios from "axios";

//const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Access";
const BASE_REST_API_URL = "http://localhost:8285/api/v1/Access";

class AccessService {
    getAllAccess() {
        return axios.get(BASE_REST_API_URL);
    }

    getAllAccessAndContext(cp_rol_id) {
        return axios.get(BASE_REST_API_URL + "AndContext?cp_rol_id=" + cp_rol_id);
    }

    CrearAccess(Access) {
        return axios.post(BASE_REST_API_URL, Access);
    }

}
export default new AccessService();