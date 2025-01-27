import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";


class ApiService {

  protected api: AxiosInstance;


  constructor(url: string) {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_ROUTE}${url}`,
      withCredentials: true, // Allow cookies
    });


    // Interceptors for response
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => { return Promise.reject(error.response?.data) }
    )
  }
}

export default ApiService;
