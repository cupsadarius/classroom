import BaseModel from './BaseModel';
import Lesson from './Lesson';
import * as uuid from 'uuid';

export default class Session extends BaseModel {
    protected startDate: Date;
    protected endDate: Date;
    protected lesson: Lesson;

    constructor() {
        super();
        this.setId(uuid.v4());
    }

    public getStartDate(): Date {
        return this.startDate;
    }

    public setStartDate(startDate: Date) {
        this.startDate = startDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }

    public setEndDate(endDate: Date) {
        this.endDate = endDate;
    }

    public getLesson(): Lesson {
        return this.lesson;
    }

    public setLesson(lesson: Lesson) {
        this.lesson = lesson;
    }

}
