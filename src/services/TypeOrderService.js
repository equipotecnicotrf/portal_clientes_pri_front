import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8081/api/v1/TypeOrders";

class TypeOrderService {
    getAllTypeOrder() {
        return axios.get(BASE_REST_API_URL);
    }
}

export default new TypeOrderService();