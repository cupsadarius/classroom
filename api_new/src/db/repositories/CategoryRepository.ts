import BaseRepository from './BaseRepository';
import Category from '../../models/Category';
import CategoryMapping from '../mappers/mappings/CategoryMapping';
import mapperFactory from '../mappers/MapperFactory';
import CategoryMapper from '../mappers/CategoryMapper';

export class CategoryRepository extends BaseRepository {
    private mapper: CategoryMapper;

    constructor() {
        super('categories');
        this.mapper = mapperFactory.getMapper('Category') as CategoryMapper;

    }

    public async getAll() {
        try {
            const data = await super.getAll() as CategoryMapping[];
            return data.map(item => this.mapper.hydrate(new Category(), item));
        } catch (e) {
            return e;
        }
    }

    public async getById(id: string) {
        try {
            const data = await super.get(id) as CategoryMapping;
            return this.mapper.hydrate(new Category(), data);
        } catch (e) {
            return e;
        }
    }
}

export const categoryRepository = new CategoryRepository();