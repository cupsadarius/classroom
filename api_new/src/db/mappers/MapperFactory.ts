import UserMapper from './UserMapper';
import AttendeeMapper from './AttendeeMapper';
import CategoryMapper from './CategoryMapper';
export class MapperFactory {

    /**
     *
     * @param className
     * @returns {UserMapper | AttendeeMapper | CategoryMapper}
     */
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
            default: {
                console.log('No mappers found for the provided entity');
            }
        }
    }
}

export default new MapperFactory();