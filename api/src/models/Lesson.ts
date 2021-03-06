import BaseModel from './BaseModel';
import Slide from './Slide';
import Category from './Category';

export default class Lesson extends BaseModel {
    private title: string;
    private description: string;
    private slides: Slide[];
    private category: Category;

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

    public setCategory(category: Category) {
        this.category = category;
    }

    public getCategory(): Category {
        return this.category;
    }

}
