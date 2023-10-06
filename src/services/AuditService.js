import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8081/api/v1/audits";

class AuditService{
    getAllAudits(){
        return axios.get(BASE_REST_API_URL);
    }

    CrearAudit(Audit){
        return axios.post(BASE_REST_API_URL,Audit);
    }
}
export default new AuditService();