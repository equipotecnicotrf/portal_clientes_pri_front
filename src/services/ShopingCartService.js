import axios from "axios";

const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/ShoppingCart";
//const BASE_REST_API_URL = "http://localhost:8285/api/v1/ShoppingCart";

class ShopingCartService {
    getCarritoxUserId(Cust_account_id, CP_user_id) {
        return axios.get(BASE_REST_API_URL + "/users?Cust_account_id=" + Cust_account_id + "&CP_user_id=" + CP_user_id)
    }

    getCarritoxUserIdxitemsxprecios(Cust_account_id, CP_user_id) {
        return axios.get(BASE_REST_API_URL + "/linesanduser?Cust_account_id=" + Cust_account_id + "&CP_user_id=" + CP_user_id)
    }

    InsertarCabecera(data) {
        return axios.post(BASE_REST_API_URL, data);
    }

    deleteCar(CarId) {
        return axios.delete(BASE_REST_API_URL + '/' + CarId)
    }
}
export default new ShopingCartService();