import Lesson from '../models/Lesson';
import LessonMapping from '../db/mappers/mappings/LessonMapping';
import FileMapping from '../db/mappers/mappings/FileMapping';
import {db} from '../db';
import {LessonRepository} from '../db/repositories/LessonRepository';
import validatorFactory from '../db/validators/ValidatorFactory';
import mapperFactory from '../db/mappers/MapperFactory';
import SlideMapper from '../db/mappers/SlideMapper';
import LessonValidator from '../db/validators/LessonValidator';

export default class LessonService {
    private validator: LessonValidator;

    constructor() {
        this.validator = validatorFactory.getValidator('Lesson') as LessonValidator;
    }

    public async getAllLessons() {
        try {
            return await this.getLessonRepository().getAll();
        } catch (e) {
            throw e;
        }
    }

    public async saveLesson(data: LessonMapping, slides: FileMapping[]) {
        try {
            const repo = this.getLessonRepository();
            const slideMapper = mapperFactory.getMapper('Slide') as SlideMapper;
            let lesson = await repo.getMapper().hydrate(new Lesson(), data);

            lesson.setSlides(slides.map((file, index) => {
                return slideMapper.convertFromUploadData(file, index);
            }));
            if (!this.validator.isValid(lesson)) {
                throw this.validator.getErrors(lesson);
            }
            return await repo.insert(repo.getMapper().dehydrate(lesson));
        } catch (e) {
            throw e;
        }
    }

    public async update(id: string, data: LessonMapping, slides: FileMapping[]) {
        try {
            const repo = this.getLessonRepository();
            let lesson = await this.getById(id);
            const slideMapper = mapperFactory.getMapper('Slide') as SlideMapper;
            lesson = await repo.getMapper().hydrate(lesson, data);
            lesson.setSlides(slides.map((file, index) => {
                return slideMapper.convertFromUploadData(file, index);
            }));
            if (!this.validator.isValid(lesson)) {
                throw this.validator.getErrors(lesson);
            }
            return await repo.insert(repo.getMapper().dehydrate(lesson));
        } catch (e) {
            throw e;
        }
    }

    public async getById(id: string) {
        try {
            return await this.getLessonRepository().getById(id);
        } catch (e) {
            throw e;
        }
    }

    public async delete(id: string) {
        try {
            return await this.getLessonRepository().delete([id]);
        } catch (e) {
            throw e;
        }
    }

    private getLessonRepository(): LessonRepository {
        return db.getRepo('lessonRepository') as LessonRepository;
    }
}

export const lessonService = new LessonService();