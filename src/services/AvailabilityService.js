import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1/Availability";

class AvailabilityService {
    getallAvailability() {
        return axios.get(BASE_REST_API_URL);
    }

}
export default new AvailabilityService();