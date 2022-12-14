import { List } from 'src/core/interfaces';
import ProductEntity from 'src/entities/product.entity';
import { CreateProductDTO } from '../dto/create-product.dto';
import { GetProductDTO } from '../dto/get-product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';

export interface IProductSerivce {
  syncProduct(): Promise<boolean>;
  syncCate(): Promise<boolean>;
  getOne(id: string): Promise<any>;
  getOneRaw(id: string): Promise<IProduct>;
  getAll(query: GetProductDTO): Promise<List<IProduct>>;
  getAllPublish(query: GetProductDTO): Promise<IProduct[]>;
  update(payload: UpdateProductDTO): Promise<IProduct>;
  create(payload: CreateProductDTO): Promise<IProduct>;
  cloneSpec(idProduct: string, idDefaultForm: string): Promise<IProduct>;
  cloneSpecBySubCate(idSubCate: string, idDefaultForm: string);
}

export type IProduct = ProductEntity;
