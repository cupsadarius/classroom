import {CategoryRepository, DbItem} from '../db/repositories/CategoryRepository';
import {db} from '../db';
import Category from '../models/Category';
import * as Q from 'q';

export class CategoryService {
    public getAllCategories() {
        const defer = Q.defer();
        const repo = this.getCategoryRepository();
        repo.getAll().then(
            (categories: Category[]) => {
                defer.resolve(categories);
            },
            () => {
                defer.reject('Failed to retrieve categories.');
            }
        );
        return defer.promise;
    }

    public addCategory(data: DbItem) {
        const defer = Q.defer();
        const category = this.populate(data);
        const repo = this.getCategoryRepository();
        if (!category.isValid()) {
            defer.reject('Invalid data provided.');
        } else {
            repo.insert(category).then(
                (lessonId: string) => {
                    defer.resolve(lessonId);
                },
                () => {
                    defer.reject('Failed to create category');
                }
            );
        }
        return defer.promise;
    }

    public getById(id: string) {
        const defer = Q.defer();
        const repo = this.getCategoryRepository();

        repo.getById(id).then(
            (category: Category) => {
                defer.resolve(category);
            },
            () => {
                defer.reject('Error while retrieving attendee.');
            }
        );

        return defer.promise;
    }

    public update(id: string, data: DbItem) {
        const defer = Q.defer();
        const repo = this.getCategoryRepository();

        repo.get(id).then(
            (categoryData: DbItem) => {
                let category = this.populate(categoryData);
                category = this.populate(data, category);
                if (!category.isValid()) {
                    defer.reject('Invalid data provided.');
                } else {
                    repo.update(id, category).then(
                        (updated: number) => {
                            if (updated) {
                                defer.resolve(category);
                            }
                        },
                        () => {
                            defer.reject('Error while updating the category');
                        }
                    );
                }
            },
            () => {
                defer.reject('Error while retrieving category.');
            }
        );

        return defer.promise;
    }

    public delete(id: string) {
        const defer = Q.defer();
        const repo = this.getCategoryRepository();

        repo.delete([id]).then(
            () => {
                defer.resolve();
            },
            () => {
                defer.reject('Error while deleting category.');
            }
        );

        return defer.promise;
    }

    private populate(data: DbItem, category?: Category) {
        const updatedCategory = category ? category : new Category();
        if (data.id || updatedCategory.getId()) {
            updatedCategory.setId(data.id || updatedCategory.getId());
        }
        updatedCategory.setName(data.name || updatedCategory.getName());
        updatedCategory.setDescription(data.description || updatedCategory.getDescription());

        return updatedCategory;
    }

    private getCategoryRepository(): CategoryRepository {
        return db.getRepo('categoryRepository') as CategoryRepository;
    }
}

export const categoryService = new CategoryService();
