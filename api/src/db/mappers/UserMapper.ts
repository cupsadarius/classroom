import {MapperInterface} from './MapperInterface';
import User from '../../models/User';
import UserMapping from './mappings/UserMapping';

export default class UserMapper implements MapperInterface<User, UserMapping> {
    public hydrate(user: User, data: UserMapping): User {
        if (data.id || user.getId()) {
            user.setId(data.id || user.getId());
        }
        user.setFirstName(data.firstName || user.getFirstName());
        user.setLastName(data.lastName || user.getLastName());
        user.setEmail(data.email || user.getEmail());
        user.setPhoneNumber(data.phoneNumber || user.getPhoneNumber());
        user.setPassword(data.password || user.getPassword());
        user.setSalt(data.salt || user.getSalt());
        user.setRoles(data.roles || user.getRoles());
        return user;
    }

    public dehydrate(user: User): UserMapping {
        const mapping = new UserMapping();
        mapping.id = user.getId();
        mapping.firstName = user.getFirstName();
        mapping.lastName = user.getLastName();
        mapping.email = user.getEmail();
        mapping.phoneNumber = user.getPhoneNumber();
        mapping.password = user.getPassword();
        mapping.salt = user.getSalt();
        mapping.roles = user.getRoles();

        return mapping;
    }
}
