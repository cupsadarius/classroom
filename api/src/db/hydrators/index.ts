import UserHydrator from './UserHydrator';

export class Hydrator<T> {
    protected getEntityClass(entity: T): string {
        if (entity && entity.constructor && entity.constructor.toString) {
            const arr = entity.constructor.toString().match(
                /function\s*(\w+)/);

            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return '';
    }

    public getHydrator(entity: {new (): T}) {
        const object = new entity();
        switch (this.getEntityClass(object)) {
            case 'User': {
                return new UserHydrator();
            }
            case 'Attendee': {
                return new UserHydrator();
            }
            default: {
                break;
            }
        }
    }

}

export default new Hydrator();
