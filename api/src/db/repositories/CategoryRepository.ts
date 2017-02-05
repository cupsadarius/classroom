import BaseRepository from './BaseRepository';
import * as Q from 'q';
import Category from '../../models/Category';

export type DbItem = {
    id: string,
    name: string,
    description: string,
};

export class CategoryRepository extends BaseRepository {
    constructor() {
        super('categories');
    }

    public getAll() {
        const defer = Q.defer();
        super.getAll().then(
            (categories: DbItem[]) => {
                const mapped = categories.map((category: DbItem) => {
                    const categoryObj = new Category();
                    categoryObj.setId(category.id);
                    categoryObj.setName(category.name);
                    categoryObj.setDescription(category.description);
                    return categoryObj;
                });
                defer.resolve(mapped);
            },
            (error: Object) => {
                console.log(error);
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public getById(id: string) {
        const defer = Q.defer();
        this.get(id).then(
            (categoryData: DbItem) => {
                const category = new Category();
                category.setId(categoryData.id);
                category.setName(categoryData.name);
                category.setDescription(categoryData.description);
                defer.resolve(category);
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }
}

export const categoryRepository = new CategoryRepository();
