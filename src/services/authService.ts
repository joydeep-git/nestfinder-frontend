import { AuthSuccessType } from "@/types/index.ts";
import ApiService from "@/services/apiService";


class AuthService extends ApiService {

  constructor() {
    super("/auth");
  }


  // Verify token during loading
  async verifyAuthToken(): Promise<AuthSuccessType> {
    return await this.api.get("/verify-token");
  };



  async signIn({ email, password }: { email: string; password: string }): Promise<AuthSuccessType> {
    return await this.api.post(`/sign-in`, { email: email.toLowerCase(), password });
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
  }): Promise<AuthSuccessType> {
    return await this.api.post(`/sign-up`, {
      firstName,
      lastName,
      number,
      email: email.toLowerCase(),
      password,
      avatar
    });
  };



  async signOut(): Promise<AuthSuccessType> {
    return await this.api.get(`/sign-out`, { withCredentials: true });
  }


}

export const authService = new AuthService();
