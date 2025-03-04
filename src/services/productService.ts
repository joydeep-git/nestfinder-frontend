import ApiService from "@/services/apiService";
import { CreateProductType, MyProductsSuccessType, ProductSuccessType } from "@/types/index";


class ProductService extends ApiService {

  constructor() {
    super("/product");
  }


  async createProduct({ data, id }: { data: CreateProductType; id: string; }): Promise<ProductSuccessType> {
    return this.api.post(`/create/${id}`, data);
  }


  async editProduct({ data, userId, productId }: { data: CreateProductType; userId: string; productId: string; }): Promise<ProductSuccessType>{
    return this.api.post(`/edit/${userId}/${productId}`, data);
  }


  async getProductDetails(id: string): Promise<ProductSuccessType> {
    return this.api.get(`/get-product-details/${id}`);
  }


  async getOwnerAllProducts(id: string): Promise<MyProductsSuccessType> {
    return this.api.get(`/owner-all-products/${id}`);
  }


  async deleteProduct({ userId, productId }: { userId: string; productId: string; }): Promise<ProductSuccessType> {
    return this.api.delete(`/delete-product/${userId}/${productId}`);
  }


}

export const productService = new ProductService();
