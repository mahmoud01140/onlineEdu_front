import axios from "axios"
export const axiosInstance = axios.create({
    baseURL: "https://abu-yusuf.vercel.app/api/",
    withCredentials: true,
})
// http://localhost:5000/api/