import BaseRepository from './BaseRepository';
import * as Q from 'q';
import Lesson from '../../models/Lesson';
import Slide from '../../models/Slide';

export type SlideData = {
    id: string,
    name: string,
    path: string,
    type: string,
    order: number,
};

export type LessonData = {
    id: string,
    title: string,
    description: string,
    slides: SlideData[],
};

export class LessonRepository extends BaseRepository {
    constructor() {
        super('lessons');
    }

    public getAll() {
        const defer = Q.defer();
        super.getAll().then(
            (lessonsData: LessonData[]) => {
                const mapped = lessonsData.map((lessonItem: LessonData) => {
                    const lesson = new Lesson();
                    lesson.setId(lessonItem.id);
                    lesson.setTitle(lessonItem.title);
                    lesson.setDescription(lessonItem.description);
                    const slides = lessonItem.slides.map((slideItem: SlideData) => {
                        const slide = new Slide();
                        slide.setId(slideItem.id);
                        slide.setName(slideItem.name);
                        slide.setPath(slideItem.path);
                        slide.setType(slideItem.type);
                        slide.setOrder(slideItem.order);
                        return slide;
                    });
                    lesson.setSlides(slides);

                    return lesson;
                });

                defer.resolve(mapped);
            },
            (error: Object) => {
                defer.reject(error);
            }
        );
        return defer.promise;
    }
}

export let lessonRepository = new LessonRepository();
