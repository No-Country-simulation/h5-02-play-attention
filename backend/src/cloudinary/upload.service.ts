import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinaryClient: typeof cloudinary,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const fileType = file.mimetype.split('/')[0];
      const extension = file.originalname.split('.').pop().toLowerCase();
      
      let resourceType: 'image' | 'video' | 'raw';
      if (fileType === 'video') {
        resourceType = 'video';
      } else if (extension === 'pdf') {
        resourceType = 'raw';
      } else {
        resourceType = 'image';
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          chunk_size: 6000000, // 6MB chunks para videos
          timeout: 120000, // 2 minutos de timeout
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  }
}
