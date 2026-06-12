import axios from "axios";
export const axiosInstance = axios.create({
baseURL: "https://chat-app-hc7g.onrender.com/api",
withCredentials: true,
});
