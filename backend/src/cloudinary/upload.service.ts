import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryResponse } from './cloudinary-response';

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
        if (file.size > 100 * 1024 * 1024) { // 100MB
          return reject(new Error('El video excede el límite de 100MB'));
        }
      } else if (extension === 'pdf') {
        resourceType = 'raw';
        if (file.size > 10 * 1024 * 1024) { // 10MB
          return reject(new Error('El archivo excede el límite de 10MB'));
        }
      } else {
        resourceType = 'image';
        if (file.size > 10 * 1024 * 1024) { // 10MB
          return reject(new Error('La imagen excede el límite de 10MB'));
        }
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

  async deleteFile(url: string): Promise<boolean> {
    try {
      // Extraer el public_id de la URL de Cloudinary
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1].split('.')[0];
      const folderPath = urlParts[urlParts.length - 2];
      const public_id = `${folderPath}/${fileName}`;

      // Eliminar el archivo de Cloudinary
      const result = await cloudinary.uploader.destroy(public_id);
      return result.result === 'ok';
    } catch (error) {
      console.error('Error al eliminar archivo de Cloudinary:', error);
      return false;
    }
  }
}
