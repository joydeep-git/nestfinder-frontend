import axios, { AxiosError, AxiosInstance } from "axios";

class ApiService {
  protected api: AxiosInstance;

  constructor(url: string) {
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_ROUTE}${url}`,
      withCredentials: true, // Allow cookies
    });

    // Interceptors for response
    this.api.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        const message = this.getErrorMessage(error);
        return Promise.reject(message);
      }
    );
  }

  // handle errors
  private getErrorMessage(error: AxiosError): string {
    if (error.response) {
      return error.response?.data?.message || 'An error occurred while processing your request.';
    } else if (error.request) {
      return 'No response from server. Please check your internet connection.';
    } else {
      return error.message || 'An unexpected error occurred.';
    }
  }
}

export default ApiService;
