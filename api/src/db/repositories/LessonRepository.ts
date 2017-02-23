import BaseRepository from './BaseRepository';
import mapperFactory from '../mappers/MapperFactory';
import LessonMapper from '../mappers/LessonMapper';
import LessonMapping from '../mappers/mappings/LessonMapping';
import Lesson from '../../models/Lesson';
import Category from '../../models/Category';

export class LessonRepository extends BaseRepository {
    private mapper: LessonMapper;

    constructor() {
        super('lessons');
        this.mapper = mapperFactory.getMapper('Lesson') as LessonMapper;
    }

    public async getAll() {
        try {
            const data: LessonMapping[] = await super.getAll() as LessonMapping[];
            return data.map(async item => await this.mapper.hydrate(new Lesson(), item));
        } catch (e) {
            return e;
        }
    }

    public async getById(id: string) {
        try {
            const data = await super.get(id) as LessonMapping;
            return this.mapper.hydrate(new Lesson(), data);
        } catch (e) {
            return e;
        }
    }

    public async getByCategory(category: Category) {
        try {
            const data = (await this.filter({categoryId: category.getId()}) as LessonMapping[]).pop();
            return await this.mapper.hydrate(new Lesson(), data);
        } catch (e) {
            return e;
        }
    }

    public getMapper() {
        return this.mapper;
    }
}

export const lessonRepository = new LessonRepository();