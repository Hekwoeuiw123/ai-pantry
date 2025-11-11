import { toast } from 'react-toastify';
import { useAuthData } from '../../context/AuthContext';
import { analyzeImage } from '../../services/aiService'
import { uploadImage } from '../../services/cloudinary'
import { addPantryItem } from '../../services/pantryService/'
import React, { useState } from 'react'
import { InfinitySpin } from 'react-loader-spinner';
import '../../styles/ImageUpload.css'
const ImageUpload = ({onSuccess}) => {
  const { currentUser } = useAuthData();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [preview, setPreview] = useState("")
  const [status, setStatus] = useState('Ready to Upload')

  const handleUploadFileChange = async (e) => {
    const image = e.target.files[0];
    if (!image) return

    setLoading(true);
    setError('');
    setPreview(URL.createObjectURL(image)); // show a preview of the image

    try {

      // First Image Upload Karenge in Cloudnary and get ImageUrl
      setStatus('1/3 Uploading Image...')
      const imageURL = await uploadImage(image)

      // If image URL mile then backend me analyze karenge img ko jo ingred dega
      setStatus('2/3 Analyzing Image...')
      const ingredients = await analyzeImage(imageURL)

      // If their is no ingredient then show that
      if (ingredients.length === 0) {
        setStatus('Done. No food items found.');
        setLoading(false);
        if (onSuccess) onSuccess()
        return;
      }

      //Now add karenge in Database
      setStatus(`3/3 Adding ${ingredients.length} items...`);

      // So here we simply calling the addpntry for each item but add pantry asynchronous hai
      // thats why we have to use await in for loop but it is too slow 
      // for (let itemName of ingredients) {
      //     const newItem = { ... };
      //     await addPantryItem(newItem); // waits one by one
      //                   }
      // because sabko wait krna pdta n ek ka khtam hone ka 
      // to solve this i used Promise .all() jo parrally handle all async task
      Promise.all([ingredients.map((itemName) => {
        const newItem = {
          name: itemName.charAt(0).toUpperCase() + itemName.slice(1),
          quantity: 1,
          category: 'Other',
          expirationDate: 'N/A',
          userID: currentUser.uid,
        };
        return addPantryItem(newItem)
      })])

      setStatus(`Success! Added ${ingredients.length} items.`);
      toast.success(`Success! Added ${ingredients.length} items.`)
      setLoading(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1400);

    } catch (err) {
      toast.error(err)
      setError(err.message);
      setStatus('Upload failed.');
      setLoading(false);
    }
  }
  return (
    <div className='image-upload-container'>
      <h2>Upload Pantry Photo</h2>
      <p>Our AI will scan your photo and add the items for you.</p>
      {
        error && <div className="error-auth">{error}</div>
      }
      {/* if preview hoga and loading nhi ho raha hoga */}
      {preview && !loading && <img src={preview} alt="Upload preview" className="upload-preview" />}

      {loading && <div className="upload-loading">
        <InfinitySpin height="24" width="24" />
        <p className="status-text">{status}</p>
      </div>}
      {
        !loading && 
        <label htmlFor="file-upload" className="btn-primary file-upload-label">
          Choose Image
        </label>
      }
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleUploadFileChange}
        disabled={loading}
        style={{ display: 'none' }} // Hide the default input
      />
    </div>
  )
}

export default ImageUpload