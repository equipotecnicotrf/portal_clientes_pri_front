import axios from "axios";

//const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/TypeOrders";
const BASE_REST_API_URL = "http://localhost:8285/api/v1/TypeOrders";

class TypeOrderService {
    getAllTypeOrder() {
        return axios.get(BASE_REST_API_URL);
    }

    createTypEOrder(typeOrder) {
        return axios.post(BASE_REST_API_URL, typeOrder)
    }

    getTypeOrderById(typeOrderId) {
        return axios.get(BASE_REST_API_URL + '/' + typeOrderId);
    }

    updateTypEOrder(typeOrderId, typeOrder) {
        return axios.put(BASE_REST_API_URL + '/' + typeOrderId, typeOrder)
    }


}

export default new TypeOrderService();