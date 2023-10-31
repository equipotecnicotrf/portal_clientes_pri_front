import axios from "axios";

//const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/OrderLines";
const BASE_REST_API_URL = "http://localhost:8285/api/v1/OrderLines";

class OrderLineService {

    InsertarOrderLine(OrderLines) {
        return axios.post(BASE_REST_API_URL, OrderLines);
    }

    updateOrderline(orderLineId, orderLine) {
        return axios.put(BASE_REST_API_URL + '/' + orderLineId, orderLine);
    }

}
export default new OrderLineService();