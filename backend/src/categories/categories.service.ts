import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from './schema/categories.model';
import {  Model } from 'mongoose';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel(Categories.name)
        private categoriesModel: Model<Categories>
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const newCategory = new this.categoriesModel(createCategoryDto);
        return newCategory.save();
    }

    async findAll(): Promise<Categories[]> {
        return await this.categoriesModel.find().exec();
    }

    async findById(id: string) {
        const getCategory = await this.categoriesModel.findById(id).populate('resources_id').exec();
        if(!getCategory) {
            throw new NotFoundException(`No se encontró categoría con ID ${id}`)
        }
        return getCategory;
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
        const updatedCategory = await this.categoriesModel.findByIdAndUpdate(id, updateCategoryDto, {new: true});
        if(!updatedCategory) {
            throw new NotFoundException(`No se pudo hallar categoría con ID ${id}`)
        }
        return updatedCategory;
    }

    async deleteCategory(id: string) {
        const deletedCategory = await this.categoriesModel.findByIdAndDelete(id);
        if(!deletedCategory) {
            throw new NotFoundException(`No se pudo hallat categoría con ID ${id}`)
        }
        return 'Se eliminó la categoría';
    }
}
