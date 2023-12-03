import axios from "axios";

const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Consecutive";
//const BASE_REST_API_URL = "http://localhost:8285/api/v1/Consecutive";

class ConsecutiveService {
    getAllConsecutives() {
        return axios.get(BASE_REST_API_URL);
    }

    getConsecutiveById(ConsecutiveId) {
        return axios.get(BASE_REST_API_URL + '/' + ConsecutiveId);
    }

    updateConsecutive(ConsecutiveId, Cuerpoconsecutive) {
        return axios.put(BASE_REST_API_URL + '/' + ConsecutiveId, Cuerpoconsecutive);
    }

    createConsecutive(consecutive) {
        return axios.post(BASE_REST_API_URL, consecutive);
    }

}

export default new ConsecutiveService();