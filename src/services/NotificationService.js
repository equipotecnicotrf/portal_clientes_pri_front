import axios from "axios";

//const BASE_REST_API_URL = "http://150.136.119.119:8285/api/v1/OrgInv";
const BASE_REST_API_URL = "http://localhost:8285/api/v1/Notifications";

class NotificationService {
    getAllNotifications() {
        return axios.get(BASE_REST_API_URL);
    }

    getNotiById(notiId) {
        return axios.get(BASE_REST_API_URL + '/' + notiId);
    }

    updateNoti(userId, user) {
        return axios.put(BASE_REST_API_URL + '/' + userId, user);
    }

    getNotificationsContext(context) {
        return axios.get(BASE_REST_API_URL + '/context?CP_Notification_context=' + context);
    }

}

export default new NotificationService();