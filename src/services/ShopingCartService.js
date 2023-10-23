import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/ShoppingCart";

class ShopingCartService {
    InsertarCabecera(data) {
        return axios.post(BASE_REST_API_URL, data);
    }
}
export default new ShopingCartService();