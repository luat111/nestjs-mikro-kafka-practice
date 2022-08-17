import { CreateSpecDTO } from "../dto/create-spec.dto";
import { UpdateSpecDTO } from "../dto/update-spec.dto";

export interface ISpecificationService {
    getAll();
    getOne(id: string);
    create(payload: CreateSpecDTO);
    update(payload: UpdateSpecDTO);
    remove(id: string);
}