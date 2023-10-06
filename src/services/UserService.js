import axios from "axios";

const BASE_REST_API_URL = "http://localhost:8081/api/v1/Users";
const USERNAME_BASE_REST_API_URL = "http://localhost:8081/api/v1/Username";

class UserService{
    getAllUsers(){
        return axios.get(BASE_REST_API_URL);
    }

    createUsers(user){
        return axios.post(BASE_REST_API_URL,user);
    }

    getUserById(userId){
        return axios.get(BASE_REST_API_URL + '/' + userId);
    }

    getUserByUsername(username){
        return axios.get(USERNAME_BASE_REST_API_URL+"?username="+username);
    }    

    updateUser(userId,user){
        return axios.put(BASE_REST_API_URL + '/' + userId,user);
    }

}

export default new UserService();