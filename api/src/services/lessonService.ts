/// <reference path="../../typings/tsd.d.ts"/>

import {LessonRepository, LessonData, SlideData} from '../db/repositories/LessonRepository';
import Lesson from '../models/Lesson';
import Slide from '../models/Slide';
import * as Q from 'q';
import {db} from '../db';
import * as uuid from 'uuid';

export type UploadData = {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number,
}
export class LessonService {
    public getAllLessons() {
        const defer = Q.defer();
        const repo = this.getLessonRepository();
        repo.getAll().then(
            (lessons: Lesson[]) => {
                defer.resolve(lessons);
            },
            () => {
                defer.reject('Failed to retrieve lessons.');
            }
        );
        return defer.promise;
    }

    public addLesson(lessonData: LessonData, slides: {}) {
        const defer = Q.defer();
        const lesson = this.populate(lessonData, slides);
        const repo = this.getLessonRepository();
        if (!lesson.isValid()) {
            defer.reject('Invalid data provided.');
        } else {
            repo.insert(lesson).then(
                (lessonId: string) => {
                    defer.resolve(lessonId);
                },
                () => {
                    defer.reject('Failed to create lesson');
                }
            );
        }
        return defer.promise;
    }

    public getById(id: string) {
        const defer = Q.defer();
        const repo = this.getLessonRepository();
        repo.get(id).then(
            (lessonData: LessonData) => {
                defer.resolve(this.populate(lessonData));
            },
            () => {
                defer.reject('Failed to retreive lesson.');
            }
        );
        return defer.promise;
    }

    private populate(lessonInfo: LessonData, slidesData?: {}, lessonObj?: Lesson): Lesson {
        const lesson = lessonObj || new Lesson();
        let slides = [] as Slide[];
        if (lessonInfo.id || lesson.getId()) {
            lesson.setId(lessonInfo.id || lesson.getId());
        }
        lesson.setTitle(lessonInfo.title || lesson.getTitle());
        lesson.setDescription(lessonInfo.description || lesson.getDescription());
        if (slidesData) {
            slides = (slidesData as UploadData[]).map((slideItem: UploadData, index: number) => {
                const slide = new Slide();
                slide.setId(uuid.v4());
                slide.setName(slideItem.filename);
                slide.setPath(slideItem.path);
                slide.setType(slideItem.mimetype);
                slide.setOrder(index);
                return slide;
            });
        }
        if (lessonInfo.slides) {
            slides = (lessonInfo.slides).map((slideItem: SlideData) => {
                const slide = new Slide();
                slide.setId(slideItem.id);
                slide.setName(slideItem.name);
                slide.setPath(slideItem.path);
                slide.setType(slideItem.type);
                slide.setOrder(slideItem.order);
                return slide;
            });
        }
        lesson.setSlides(slides || lesson.getSlides());
        return lesson;
    }

    private getLessonRepository(): LessonRepository {
        return db.getRepo('lessonRepository') as LessonRepository;
    }
}

export let lessonService = new LessonService();
