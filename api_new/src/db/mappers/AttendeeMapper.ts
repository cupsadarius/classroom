import {MapperInterface} from './MapperInterface';
import Attendee from '../../models/Attendee';
import UserMapping from './mappings/UserMapping';

export default class UserMapper implements MapperInterface<Attendee, UserMapping> {
    public hydrate(attendee: Attendee, data: UserMapping): Attendee {
        if (data.id || attendee.getId()) {
            attendee.setId(data.id || attendee.getId());
        }
        attendee.setFirstName(data.firstName || attendee.getFirstName());
        attendee.setLastName(data.lastName || attendee.getLastName());
        attendee.setEmail(data.email || attendee.getEmail());
        attendee.setPhoneNumber(data.phoneNumber || attendee.getPhoneNumber());
        attendee.setPassword(data.password || attendee.getPassword());
        attendee.setSalt(data.salt || attendee.getSalt());
        attendee.setRoles(data.roles || attendee.getRoles());

        return attendee;
    }

    public dehydrate(attendee: Attendee): UserMapping {
        const mapping = new UserMapping();
        mapping.id = attendee.getId();
        mapping.firstName = attendee.getFirstName();
        mapping.lastName = attendee.getLastName();
        mapping.email = attendee.getEmail();
        mapping.phoneNumber = attendee.getPhoneNumber();
        mapping.password = attendee.getPassword();
        mapping.salt = attendee.getSalt();
        mapping.roles = attendee.getRoles();

        return mapping;
    }
}
