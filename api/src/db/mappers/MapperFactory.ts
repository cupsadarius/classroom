import UserMapper from './UserMapper';
import AttendeeMapper from './AttendeeMapper';
import CategoryMapper from './CategoryMapper';
import LessonMapper from './LessonMapper';
import SlideMapper from './SlideMapper';

export class MapperFactory {

    public getMapper(className: string) {
        switch (className) {
            case 'User': {
                return new UserMapper();
            }
            case 'Attendee': {
                return new AttendeeMapper();
            }
            case 'Category': {
                return new CategoryMapper();
            }
            case 'Lesson': {
                return new LessonMapper();
            }
            case 'Slide': {
                return new SlideMapper();
            }
            default: {
                console.log('No mappers found for the provided entity');
            }
        }
    }
}

export default new MapperFactory();