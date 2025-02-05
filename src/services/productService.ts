import ApiService from "@/services/apiService";
import { CreateProductType, ProductSuccessType } from "@/types/index";


class ProductService extends ApiService {

  constructor() {
    super("/product");
  }

  async createProduct({data, id} :{ data: CreateProductType; id: string; }): Promise<ProductSuccessType> {
    return this.api.post(`/create/${id}`, data);
  }


}

export const productService = new ProductService();
