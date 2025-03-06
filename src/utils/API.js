import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    baseURL: "http://localhost:3000",
    headers:{
        "Content-Type": "application/json"
    },
    withCredentials: true // Allows cookies to be sent
});

// Add token to headers using Axios interceptors
API.interceptors.request.use((config) => {
    const token = Cookies.get('token') // get the token 

    // check if token in valid
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
})

export default API;
