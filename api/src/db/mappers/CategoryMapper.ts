import {MapperInterface} from './MapperInterface';
import Category from '../../models/Category';
import CategoryMapping from './mappings/CategoryMapping';

export default class CategoryMapper implements MapperInterface<Category, CategoryMapping> {
    public hydrate(category: Category, data: CategoryMapping): Category {
        if (data.id || category.getId()) {
            category.setId(data.id || category.getId());
        }
        category.setName(data.name || category.getName());
        category.setDescription(data.description || category.getDescription());

        return category;
    }

    public dehydrate(category: Category): CategoryMapping {
        const mapping = new CategoryMapping();
        mapping.id = category.getId();
        mapping.name = category.getName();
        mapping.description = category.getDescription();

        return mapping;
    }
}