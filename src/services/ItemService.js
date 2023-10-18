import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/Items";

class ItemService {
    getAllItems() {
        return axios.get(BASE_REST_API_URL);
    }
}

export default new ItemService();