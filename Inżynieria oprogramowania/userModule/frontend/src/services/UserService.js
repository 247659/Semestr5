import axios from 'axios'

const USER_API_URL = 'http://localhost:8080/api/users'

class UserService{
    getUsers(){
        return axios.get(USER_API_URL);
    }

    fillUserInformation(username, requestData) {
        return axios.put(`${USER_API_URL}/${username}/update-data`, requestData);    }
}


export default new UserService();