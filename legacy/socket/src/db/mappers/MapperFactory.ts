import UserMapper from './UserMapper';
import EventMapper from './EventMapper';

export class MapperFactory {

    /**
     * Returns an instance of mapper for the given class.
     */
    public getMapper(className: string): UserMapper | EventMapper {
        switch (className) {
            case 'User': {
                return new UserMapper();
            }
            case 'Event': {
                return new EventMapper();
            }
            default: {
                console.log('No mappers found for the provided entity');
            }
        }
    }
}

export default new MapperFactory();