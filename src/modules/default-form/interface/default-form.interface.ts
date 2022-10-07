import DefaultFormEntity from 'src/entities/default-form.entity';
import { CreateDefaultFormDTO } from '../dto/create-default-form.dto';
import { GetDefaultFormDTO } from '../dto/get-default-form.dto';
import { UpdateDefaultFormDTO } from '../dto/update-default-form.dto';

export interface IDefaultFormService {
  getOne(id: string): Promise<IDefaultForm>;
  getOneRaw(id: string): Promise<IDefaultForm>;
  getAll(query: GetDefaultFormDTO): Promise<IDefaultForm[]>;
  update(payload: UpdateDefaultFormDTO): Promise<IDefaultForm>;
  create(payload: CreateDefaultFormDTO): Promise<IDefaultForm>;
  remove(id: string): Promise<string>;
}

export type IDefaultForm = DefaultFormEntity;
