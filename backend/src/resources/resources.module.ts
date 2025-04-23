import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CategoriesModule } from '../categories/categories.module';
import { Categories, CategoriesSchema } from '../categories/schema/categories.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
       {name: Categories.name,schema: CategoriesSchema
      }]),
    CloudinaryModule ,
    CategoriesModule
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
