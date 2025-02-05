import { AuthSuccessType, UserProfileUpdateType } from "@/types/index.ts";
import ApiService from "@/services/apiService";


class UserService extends ApiService {

  constructor() {
    super("/user");
  }


  // Update User Details
  async updateDetails({ user, id }: { id: string; user: UserProfileUpdateType }): Promise<AuthSuccessType> {
    return await this.api.post(`/update-details/${id}`, user);
  }


  // Update Profile Picture
  async updateProfilePicture({ avatar, id }: { avatar: string; id: string; }): Promise<AuthSuccessType> {
    return await this.api.post(`/update-picture/${id}`, { avatar });
  }



  // Delete User Profile
  async deleteProfile(id: string): Promise<AuthSuccessType> {
    return await this.api.delete(`/delete-user/${id}`);
  }



  // Change Password
  // async changePassword() {

  // const res = await this.api('/change-password', { oldPassword, newPassword });

  // return res.data;

  // }


}

export const userService = new UserService();
