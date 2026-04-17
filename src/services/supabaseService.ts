import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

class StorageService {

  private supabase = createClient(supabaseUrl, supabaseKey);

  async getDownloadUrl({ file, folder }: { file: File; folder: "profile" | "property"; }) {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const bucket = folder === "profile" ? "profile_images" : "property_images";

      const { data: uploadData, error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Use the actual stored path from the upload response (more reliable)
      const { data: publicUrlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      return publicUrlData.publicUrl;

    } catch (error) {
      throw error;
    }
  }

  async deleteImage({ path, folder }: { path: string; folder: "profile" | "property"; }) {
    try {
      const bucket = folder === "profile" ? "profile_images" : "property_images";

      // Extract just the file name from a full public URL if needed
      const fileName = path.includes("/storage/v1/object/public/")
        ? path.split(`/${bucket}/`).pop()!
        : path;

      const { error } = await this.supabase.storage.from(bucket).remove([fileName]);

      if (error) throw error;

    } catch (error) {
      throw error;
    }
  }
}

export const storageService = new StorageService();
