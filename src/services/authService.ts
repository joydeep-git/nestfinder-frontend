import { AxiosResponseType } from "@/types/index.ts";
import ApiService from "@/services/apiService";


class AuthService extends ApiService {

  constructor() {
    super("/auth");
  }


  // Verify token during loading
  async verifyAuthToken(): Promise<AxiosResponseType> {
    const res = await this.api.get("/verify-token");
    return res.data;
  };



  async signIn({ email, password }: { email: string; password: string }): Promise<AxiosResponseType> {
    const res = await this.api.post(`/sign-in`, { email, password });
    return res.data;
  };



  async signUp({
    firstName,
    lastName,
    email,
    password,
    number,
    avatar
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    number: string;
    avatar?: string;
  }): Promise<AxiosResponseType> {
    const res = await this.api.post(`/sign-up`, {
      firstName,
      lastName,
      number,
      email,
      password,
      avatar
    });
    return res.data;
  };



  async signOut(): Promise<void> {
    const res = await this.api.get(`/sign-out`);
    return res.data;
  }


}

export const authService = new AuthService();
