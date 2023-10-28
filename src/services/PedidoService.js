import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/crearOrden";

class PedidoService {
    Insertarpedido(order) {
        return axios.post(BASE_REST_API_URL, order);
    }



}
export default new PedidoService();