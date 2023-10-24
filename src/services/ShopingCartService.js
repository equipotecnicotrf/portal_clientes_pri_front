import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/ShoppingCart";

class ShopingCartService {
    getCarritoxUserId(Cust_account_id, CP_user_id) {
        return axios.get(BASE_REST_API_URL + "/users?Cust_account_id=" + Cust_account_id + "&CP_user_id=" + CP_user_id)
    }

    InsertarCabecera(data) {
        return axios.post(BASE_REST_API_URL, data);
    }
}
export default new ShopingCartService();