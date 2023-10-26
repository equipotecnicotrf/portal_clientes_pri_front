import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/IVA";

class IVAService {
    getAllIva() {
        return axios.get(BASE_REST_API_URL);
    }

    getIVAById(IvaId) {
        return axios.get(BASE_REST_API_URL + '/' + IvaId);
    }

    updateIva(Ivaid, CuerpoIva) {
        return axios.put(BASE_REST_API_URL + '/' + Ivaid, CuerpoIva);
    }

    createIva(iva) {
        return axios.post(BASE_REST_API_URL, iva);
    }


}

export default new IVAService();