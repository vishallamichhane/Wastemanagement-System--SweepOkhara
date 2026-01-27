import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = async (file) => {
    try {
      if (!file) return null
      const response = await cloudinary.uploader.upload(file, {
        resource_type:'auto',
        folder:"waste-management-system/reports"
      })
      
      fs.unlinkSync(file)

      return response.url
    
    } catch (error) {
        fs.unlinkSync(file)
        throw Error(error.message)
    }
}

const deleteFromCloudinary = async(fileUrl) => {
  try {
    await cloudinary.uploader.destroy(fileUrl.split('/').pop())
  } catch (error) {
    throw Error(error.message)
  }
}

export { uploadToCloudinary, deleteFromCloudinary}