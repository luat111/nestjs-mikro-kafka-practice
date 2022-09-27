import SpecValueEntity from 'src/entities/spec-value.entity';
import { CreateSpecValueDTO } from '../dto/create-spec-value.dto';
import { UpdateSpecValueDTO } from '../dto/update-spec-value.dto';

export interface ISpecValueService {
  commit(payload: ISpecValue | ISpecValue[]): Promise<void>;
  getAll(): Promise<ISpecValue[]>;
  getOne(id: string): Promise<ISpecValue>;
  create(payload: CreateSpecValueDTO): Promise<ISpecValue>;
  update(payload: UpdateSpecValueDTO): Promise<ISpecValue>;
  remove(id: string): Promise<string>;
}

export type ISpecValue = SpecValueEntity;
