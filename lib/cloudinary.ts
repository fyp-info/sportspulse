import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export interface UploadResult {
  url: string
  publicId: string
}

/** Upload an image (as a data URI) to Cloudinary under sportspulse/<folder>. */
export async function uploadImage(dataUri: string, folder: string): Promise<UploadResult> {
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: `sportspulse/${folder}`,
    resource_type: 'image',
    overwrite: true,
  })
  return { url: res.secure_url, publicId: res.public_id }
}

export { cloudinary }
