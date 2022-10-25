import { List } from 'src/core/interfaces';
import SpecCategoryEntity from 'src/entities/spec-category.entity';
import { CreateSpecCategoryDTO } from '../dto/create-spec-category.dto';
import { GetSpecCategoryDTO } from '../dto/get-spec-category.dto';
import { UpdateSpecCategoryDTO } from '../dto/update-spec-category.dto';

export interface ISpecCategorySerivce {
  getAll(query: GetSpecCategoryDTO): Promise<List<ISpecCateogry>>;
  getFilter(): Promise<ISpecCateogry[]>;
  getOne(id: string): Promise<ISpecCateogry>;
  create(payload: CreateSpecCategoryDTO): Promise<ISpecCateogry>;
  update(payload: UpdateSpecCategoryDTO): Promise<ISpecCateogry>;
  remove(id: string): Promise<string>;
}

export type ISpecCateogry = SpecCategoryEntity;
