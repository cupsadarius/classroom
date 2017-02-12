import {db} from '../db';
import {CategoryRepository} from '../db/repositories/CategoryRepository';
import Category from '../models/Category';
import CategoryMapping from '../db/mappers/mappings/CategoryMapping';
import validatorFactory from '../db/validators/ValidatorFactory';
import CategoryValidator from '../db/validators/CategoryValidator';

export default class CategoryService {
    private validator: CategoryValidator;

    constructor() {
        this.validator = validatorFactory.getValidator('Category') as CategoryValidator;
    }

    public async getById(id: string) {
        try {
            return await this.getCategoryRepository().getById(id);
        } catch (e) {
            return e;
        }
    }

    public async getAllCategories() {
        try {
            return (await this.getCategoryRepository().getAll() as CategoryMapping[]).map(item => this.getCategoryRepository().getMapper().hydrate(new Category(), item));
        } catch (e) {
            return e;
        }
    }

    public async addCategory(data: CategoryMapping) {
        try {
            const repo = this.getCategoryRepository();
            const category = repo.getMapper().hydrate(new Category(), data);
            if (!this.validator.isValid(category)) {
                return this.validator.getErrors(category);
            }
            return await repo.insert(repo.getMapper().dehydrate(category));
        } catch (e) {
            return e;
        }
    }

    public async updateCategory(id: string, data: CategoryMapping) {
        try {
            const repo = this.getCategoryRepository();
            let category = await repo.getById(id);
            let category = repo.getMapper().hydrate(category, data);
            if (!this.validator.isValid(category)) {
                return this.validator.getErrors(category);
            }
            return await repo.update(id, repo.getMapper().dehydrate(category));
        } catch (e) {
            return e;
        }
    }

    public async delete(id: string) {
        try {
            return await this.getCategoryRepository().delete([id]);
        } catch (e) {
            return e;
        }
    }
    private getCategoryRepository(): CategoryRepository {
        return db.getRepo('categoryRepository') as CategoryRepository;
    }
}

export const categoryService = new CategoryService();