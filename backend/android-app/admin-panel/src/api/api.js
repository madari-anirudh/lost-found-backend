import axios from "axios";

const API = axios.create({
  baseURL: "https://lost-found-api-q597.onrender.com"
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("adminToken");

  if(token){
    req.headers.Authorization = "Bearer " + token;
  }

  return req;

});

export default API;