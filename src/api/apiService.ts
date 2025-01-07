import axios, { AxiosInstance } from "axios";

class ApiService {

  protected api: AxiosInstance;

  constructor(url: string) {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_ROUTE + url,
      withCredentials: true,
    });


    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error("API error : ", error.response?.data?.message || error.message);
        return Promise.reject(error);
      }
    );
  }

}

export default ApiService;
