import ApiService from "@/api/apiService";


class ProductService extends ApiService {

  constructor() {
    super("/product");
  }


}

export const productService = new ProductService();
