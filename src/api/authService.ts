import { UserDataType, verifyUserType } from "@/types/index.ts";
import ApiService from "@/api/apiService.ts";


class AuthService extends ApiService {

  constructor() {
    super("/auth");
  }


  // Verify token during loading
  async verifyAuthToken(token: string): Promise<verifyUserType> {
    const res = await this.api.post(`/verify-user`, { token });
    return res.data;
  };



  async signIn({ email, password }: { email: string; password: string }): Promise<UserDataType> {
    const res = await this.api.post(`/signin`, { email, password });
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
  }): Promise<UserDataType> {
    const res = await this.api.post(`/signup`, {
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
    const res = await this.api.get(`/signout`);
    return res.data;
  }


}

export const authService = new AuthService();
