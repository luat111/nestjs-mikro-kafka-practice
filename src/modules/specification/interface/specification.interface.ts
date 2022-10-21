import SpecificationEntity from 'src/entities/specification.entity';
import { CreateSpecDTO } from '../dto/create-spec.dto';
import { GetSpecDTO } from '../dto/get-spec.dto';
import { UpdateSpecDTO } from '../dto/update-spec.dto';

export interface ISpecificationService {
  getAll(query: GetSpecDTO): Promise<ISpecification[]>;
  getFilter(): Promise<ISpecification[]>;
  getOne(id: string): Promise<ISpecification>;
  create(payload: CreateSpecDTO): Promise<ISpecification>;
  update(payload: UpdateSpecDTO): Promise<ISpecification>;
  remove(id: string): Promise<string>;
}

export type ISpecification = SpecificationEntity;
