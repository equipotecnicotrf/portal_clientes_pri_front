import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/ShoppingCartLines";

class ShoppingCartLines {
    postLineaCarrito(linea) {
        return axios.post(BASE_REST_API_URL, linea);
    }

    getLineCarritobyCartId(CartId) {
        return axios.get(BASE_REST_API_URL + '/cartid/' + CartId);
    }

    getLineCarritoItemsbyCartId(CartId, Cust_account_id) {
        return axios.get(BASE_REST_API_URL + '/items/?cartid=' + CartId + '&Cust_account_id=' + Cust_account_id);
    }

    deleteCarline(CarLineId) {
        return axios.delete(BASE_REST_API_URL + '/' + CarLineId)
    }

}
export default new ShoppingCartLines();