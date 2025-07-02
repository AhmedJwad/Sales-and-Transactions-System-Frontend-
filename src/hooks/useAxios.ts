import axios from "axios";

export default function useAxios() {
  const baseURL = "https://localhost:7027/api/";
  const axiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return axiosInstance;
}