import {MapperInterface} from './MapperInterface';
import Category from '../../models/Category';
import CategoryMapping from './mappings/CategoryMapping';
import * as uuid from 'uuid';

export default class CategoryMapper implements MapperInterface<Category, CategoryMapping> {
    /**
     * Populates a category object based on it's mapping.
     */
    public hydrate(category: Category, data: CategoryMapping): Category {
        if (data.id || category.getId()) {
            category.setId(data.id || category.getId());
        }
        category.setName(data.name || category.getName());
        category.setDescription(data.description || category.getDescription());

        return category;
    }

    /**
     * Extracts the data from a category object.
     */
    public dehydrate(category: Category): CategoryMapping {
        const mapping = new CategoryMapping();
        mapping.id = category.getId() ? category.getId() : uuid.v4();
        mapping.name = category.getName();
        mapping.description = category.getDescription();

        return mapping;
    }
}