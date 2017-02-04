import BaseModel from './BaseModel';
import Slide from './Slide';

export default class Lesson extends BaseModel {
    private title: string;
    private description: string;
    private slides: Slide[];
    private categoryId: string;

    constructor() {
        super();
        this.slides = [];
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string) {
        this.title = title;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public getSlides(): Slide[] {
        return this.slides;
    }

    public setSlides(slides: Slide[]) {
        this.slides = slides;
    }

    public addSlide(slide: Slide) {
        this.slides.push(slide);
    }

    public isValid(): boolean {
        return true;
    }

    public setCategoryId(categoryId: string) {
        this.categoryId = categoryId;
    }

    public getCategoryId(): string {
        return this.categoryId;
    }
}
