import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/Items";

class ItemService {
    getAllItems() {
        return axios.get(BASE_REST_API_URL);
    }

    getItemsConDisponibilidad() {
        return axios.get(BASE_REST_API_URL + "/itemscondisponibilidad")
    }

    getItemsSinDisponibilidad() {
        return axios.get(BASE_REST_API_URL + "/itemshazpedido")
    }

    getItemsLinea() {
        return axios.get(BASE_REST_API_URL + "/itemsLinea")
    }

    getItemsAcabado() {
        return axios.get(BASE_REST_API_URL + "/itemsAcabado")
    }

    getItemsCaras() {
        return axios.get(BASE_REST_API_URL + "/itemsCaras")
    }

    getItemsDiseno() {
        return axios.get(BASE_REST_API_URL + "/itemsDiseno")
    }

    getItemsSustrato() {
        return axios.get(BASE_REST_API_URL + "/itemsSustrato")
    }

    getItemsEspesor() {
        return axios.get(BASE_REST_API_URL + "/itemsEspesor")
    }

    getItemsFormato() {
        return axios.get(BASE_REST_API_URL + "/itemsFormato")
    }
}

export default new ItemService();