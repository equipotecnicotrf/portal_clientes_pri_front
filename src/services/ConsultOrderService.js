import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8285/api/v1";

class ConsultOrderService {

    getOrdersByCustomer(buyingPartyId, transactionTypeCode, statusCode, creationDateFrom, creationDateTo) {
        return axios.get(BASE_REST_API_URL + "/getOrdersLinesAndHeaders?buyingPartyId=" + buyingPartyId + "&transactionTypeCode=" + transactionTypeCode + "&statusCode=" + statusCode + "&creationDateFrom=" + creationDateFrom + "&creationDateTo=" + creationDateTo)
    }

    getOrderByOrderNumber(orderNumber) {
        return axios.get(BASE_REST_API_URL + "getOrderByOrderNumber?orderNumber=" + orderNumber)
    }

}
export default new ConsultOrderService();