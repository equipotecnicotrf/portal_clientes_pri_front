import axios from "axios";

const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/sendMessage";
//const BASE_REST_API_URL = "http://localhost:8285/api/v1/sendMessage";

class EmailService {
    Sendmessage(email) {
        return axios.post(BASE_REST_API_URL, email);
    }
}
export default new EmailService();