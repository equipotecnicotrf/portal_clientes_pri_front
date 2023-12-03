import axios from "axios";

//const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Contexts";
const BASE_REST_API_URL = "http://localhost:8285/api/v1/Contexts";

class ContextService {
    getAllContext() {
        return axios.get(BASE_REST_API_URL);
    }
}
export default new ContextService();