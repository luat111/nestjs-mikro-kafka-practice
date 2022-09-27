import SpecCategoryEntity from 'src/entities/spec-category.entity';
import { CreateSpecCategoryDTO } from '../dto/create-spec-category.dto';
import { UpdateSpecCategoryDTO } from '../dto/update-spec-category.dto';

export interface ISpecCategorySerivce {
  getAll(): Promise<ISpecCateogry[]>;
  getOne(id: string): Promise<ISpecCateogry>;
  create(payload: CreateSpecCategoryDTO): Promise<ISpecCateogry>;
  update(payload: UpdateSpecCategoryDTO): Promise<ISpecCateogry>;
  remove(id: string): Promise<string>;
}

export type ISpecCateogry = SpecCategoryEntity;
