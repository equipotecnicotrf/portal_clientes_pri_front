import axios from "axios";

const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Items";
//const BASE_REST_API_URL = "http://localhost:8285/api/v1/Items";

class ItemService {
    getAllItems() {
        return axios.get(BASE_REST_API_URL);
    }

    getItemsConDisponibilidad(Cust_account_id) {
        return axios.get(BASE_REST_API_URL + "/itemscondisponibilidad?Cust_account_id=" + Cust_account_id)
    }

    getItemsSinDisponibilidad(Cust_account_id) {
        return axios.get(BASE_REST_API_URL + "/itemshazpedido?Cust_account_id=" + Cust_account_id)
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