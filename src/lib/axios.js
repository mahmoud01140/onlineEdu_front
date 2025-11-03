import axios from "axios"
export const axiosInstance = axios.create({
    baseURL: "https://online-edu-front.vercel.app/api/",
    withCredentials: true,
})