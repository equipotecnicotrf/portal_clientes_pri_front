import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8081/api/v1/OrgInv";

class InvService{
    getAllInv(){
        return axios.get(BASE_REST_API_URL);
    }
}

export default new InvService();