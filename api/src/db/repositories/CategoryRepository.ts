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

    /**
     * Returns all categories.
     */
    public async getAll(): Promise<Category[]> {
        try {
            const data = await super.getAll() as CategoryMapping[];
            return data.map(item => this.mapper.hydrate(new Category(), item));
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns a Category based on it's id.
     */
    public async getById(id: string): Promise<Category> {
        try {
            const data = await super.get(id) as CategoryMapping;
            return this.mapper.hydrate(new Category(), data);
        } catch (e) {
            return e;
        }
    }

    /**
     * Returns an instance of the mapper.
     */
    public getMapper(): CategoryMapper {
        return this.mapper;
    }
}

export const categoryRepository = new CategoryRepository();