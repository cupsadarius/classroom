import UserMapper from './UserMapper';
import AttendeeMapper from './AttendeeMapper';
import CategoryMapper from './CategoryMapper';
import LessonMapper from './LessonMapper';
import SlideMapper from './SlideMapper';
import SessionMapper from './SessionMapper';
import ClassroomMapper from './ClassroomMapper';
export class MapperFactory {

    /**
     * Returns an instance of mapper for the given class.
     */
    public getMapper(className: string): AttendeeMapper | UserMapper | CategoryMapper | LessonMapper | SlideMapper | SessionMapper | ClassroomMapper {
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
            case 'Session': {
                return new SessionMapper();
            }
            case 'Classroom': {
                return new ClassroomMapper();
            }
            default: {
                console.log('No mappers found for the provided entity');
            }
        }
    }
}

export default new MapperFactory();