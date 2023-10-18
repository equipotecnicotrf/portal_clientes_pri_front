import axios from "axios";

//const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/audits";
const BASE_REST_API_URL = "http://localhost:8285/api/v1/audits";

class AuditService {
    getAllAudits() {
        return axios.get(BASE_REST_API_URL);
    }

    CrearAudit(Audit) {
        return axios.post(BASE_REST_API_URL, Audit);
    }
}
export default new AuditService();