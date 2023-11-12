import axios from "axios";

//const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Order";
const BASE_REST_API_URL = "http://localhost:8285/api/v1/Order";

class OrderService {
    InsertarOrder(order) {
        return axios.post(BASE_REST_API_URL, order);
    }

    getorderbyCartId(CartId) {
        return axios.get(BASE_REST_API_URL + '/cartid/' + CartId);
    }

    updateOrder(orderId, order) {
        return axios.put(BASE_REST_API_URL + '/' + orderId, order);
    }

}
export default new OrderService();