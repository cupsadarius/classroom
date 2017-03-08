import UserMapper from './UserMapper';
export class MapperFactory {

    /**
     * Returns an instance of mapper for the given class.
     */
    public getMapper(className: string): UserMapper {
        switch (className) {
            case 'User': {
                return new UserMapper();
            }

            default: {
                console.log('No mappers found for the provided entity');
            }
        }
    }
}

export default new MapperFactory();