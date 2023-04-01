import supabaseClient from "../utils/supabaseClient";

export async function storageUpload(bucket, imagepath, image) {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(imagepath, image, {
        upsert: true,
      });
  
    if (error) {
      return error;
    }
    if (data) {
      const { data: { publicUrl }, error } = await supabaseClient.storage.from(bucket).getPublicUrl(imagepath);
      const publicURL = publicUrl;
  
      return { error, publicURL };
    }
}