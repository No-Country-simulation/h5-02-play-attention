import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: async(configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get('cloud_name'),
      api_key: configService.get('api_key'),
      api_secret: configService.get('api_secret')
    });
    return cloudinary;
  },
  inject: [ConfigService],
};