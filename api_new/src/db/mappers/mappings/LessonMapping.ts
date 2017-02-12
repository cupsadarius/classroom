import SlideMapping from './SlideMapping';

export default class LessonMapping {
  public id: string;
  public title: string;
  public description: string;
  public categoryId: string;
  public slides: SlideMapping[];
}