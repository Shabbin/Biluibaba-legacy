import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["Cache-Control"] = "no-cache";
  config.headers["Pragma"] = "no-cache";
  config.headers["Expires"] = "0";
  return config;
});

export default axiosInstance;
