import {userRepository} from './UserRepository';
import {blacklistRepository} from './BlacklistRepository';
import {attendeeRepository} from './AttendeeRepository';
import BaseRepository from './BaseRepository';

export let repos: {[key: string]: BaseRepository} = {userRepository, blacklistRepository, attendeeRepository};
