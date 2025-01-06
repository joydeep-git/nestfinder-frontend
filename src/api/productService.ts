import ApiService from "@/api/apiService.ts";


class ProductService extends ApiService{

  constructor() {
    super("/product");
  }

  

  // async createProduct(token: string): Promise<verifyUserType> {
  //   return await api.post(`${this.auth_route}/verify-user`, { token });
  // };


}

export const productService = new ProductService();
