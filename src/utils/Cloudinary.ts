import { v2 as cloudinary } from 'cloudinary';

import crypto from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default class Cloudinary {
  static uploader = async (file: any, folder: any) => {
    try {
      const result = await cloudinary.uploader.upload(
        file,
        {
          folder: folder || 'lms',
        },
        (error, result) => {
          if (error) {
            console.log(error);
            return error;
          }
          return result;
        }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  static async upload(req: any) {
    console.log(req.file.location);
    let file = req.file === undefined || null ? 'no file' : req.file.location;
    let response = await this.uploader(file, 'lms');
    if (response === undefined || response === null) {
      console.log(req.file);
      return file;
    }
    console.log(response);
    return { url: response.url, fileUrl: response.secure_url };
  }

  static secretGenerator = () => crypto.randomBytes(48).toString('hex');
}
