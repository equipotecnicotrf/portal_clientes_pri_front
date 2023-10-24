import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/ShoppingCartLines";

class ShoppingCartLines {
    postLineaCarrito(linea) {
        return axios.post(BASE_REST_API_URL, linea);
    }

    getLineCarritobyCartId(CartId) {
        return axios.get(BASE_REST_API_URL + '/cartid/' + CartId);
    }

}
export default new ShoppingCartLines();