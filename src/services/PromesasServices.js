import axios from "axios";

const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/ServicePromises";
//const BASE_REST_API_URL = "http://localhost:8285/api/v1/ServicePromises";

class PromesasServices {
    getAllpromises() {
        return axios.get(BASE_REST_API_URL);
    }

    getpromisesById(Id) {
        return axios.get(BASE_REST_API_URL + '/' + Id);
    }

    updatepromises(Id, promises) {
        return axios.put(BASE_REST_API_URL + '/' + Id, promises);
    }


}

export default new PromesasServices();