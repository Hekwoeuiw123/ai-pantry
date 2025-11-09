import axios from 'axios';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_KEY);

  try {
    // data yani ki img post kr diya mean save ho jayega in cloudanry
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME_KEY}/image/upload`,
      formData
    );
    // Return krta hai secure URL of the uploaded image 
    return res.data.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw new Error('Failed to upload image.');
  }
};