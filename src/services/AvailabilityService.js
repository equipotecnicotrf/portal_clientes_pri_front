import axios from "axios";

const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/Availability";
//const BASE_REST_API_URL = "http://localhost:8285/api/v1/Availability";

class AvailabilityService {
    getallAvailability() {
        return axios.get(BASE_REST_API_URL);
    }

    getAvailabilityItem(Itemid) {
        return axios.get(BASE_REST_API_URL + "/Item?inventory_item_id=" + Itemid);
    }

}
export default new AvailabilityService();