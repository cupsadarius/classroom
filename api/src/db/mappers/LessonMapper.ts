import LessonMapping from './mappings/LessonMapping';
import Lesson from '../../models/Lesson';
import Slide from '../../models/Slide';
import {categoryService} from '../../services/categoryService';
import SlideMapper from './SlideMapper';

export default class LessonMapper {

    /**
     * Populates a lesson object based on it's data mapping.
     */
    public async hydrate(lesson: Lesson, data: LessonMapping): Promise<Lesson> {
        try {
            const slideMapper = new SlideMapper();
            if (data.id || lesson.getId()) {
                lesson.setId(data.id || lesson.getId());
            }
            lesson.setTitle(data.title || lesson.getTitle());
            lesson.setDescription(data.description || lesson.getDescription());

            if (
                (data.categoryId && !lesson.getCategory()) ||
                (
                data.categoryId && lesson.getCategory() &&
                data.categoryId !== lesson.getCategory().getId())
            ) {
                const category = await categoryService.getById(data.categoryId);
                lesson.setCategory(category);
            }

            if (data.slides && !lesson.getSlides() || data.slides.length !== lesson.getSlides().length) {
                lesson.setSlides(data.slides.map((slide) => slideMapper.hydrate(new Slide(), slide)));
            }
        } catch (e) {
            console.log(e);
        }
        return lesson;
    }

    /**
     * Extracts the data from a lesson object.
     */
    dehydrate(lesson: Lesson) {
        const mapping = new LessonMapping();
        const slideMapper = new SlideMapper();
        mapping.id = lesson.getId();
        mapping.description = lesson.getDescription();
        mapping.title = lesson.getTitle();
        mapping.categoryId = lesson.getCategory().getId();
        mapping.slides = lesson.getSlides().map(slideMapper.dehydrate);

        return mapping;
    }
}