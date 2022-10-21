import SpecValueEntity from 'src/entities/spec-value.entity';
import { CreateSpecValueDTO } from '../dto/create-spec-value.dto';
import { GetSpecValueDTO } from '../dto/get-spec-value.dto';
import { UpdateSpecValueDTO } from '../dto/update-spec-value.dto';

export interface ISpecValueService {
  getAll(query: GetSpecValueDTO): Promise<ISpecValue[]>;
  getFilter(specId: string): Promise<ISpecValue[]>;
  getOne(id: string): Promise<ISpecValue>;
  create(payload: CreateSpecValueDTO): Promise<ISpecValue>;
  update(payload: UpdateSpecValueDTO): Promise<ISpecValue>;
  remove(id: string): Promise<string>;
}

export type ISpecValue = SpecValueEntity;
