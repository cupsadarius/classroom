import User, {UserData} from '../../models/User';

export default class UserHydrator {
    public hydrate(user: User, data: UserData): User {
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

    public dehydrate(user: User): User {
        return user;
    }
}
