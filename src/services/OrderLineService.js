import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/OrderLines";

class OrderLineService {

    InsertarOrderLine(OrderLines) {
        return axios.post(BASE_REST_API_URL, OrderLines);
    }

}
export default new OrderLineService();