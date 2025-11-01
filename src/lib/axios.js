import axios from "axios"
export const axiosInstance = axios.create({
    baseURL: "https://abu-yusuf.vercel.app/",
    withCredentials: true,
})