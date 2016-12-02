import {userRepository} from './UserRepository';
import {blacklistRepository} from './BlacklistRepository';
import BaseRepository from './BaseRepository';

export let repos: {[key: string]: BaseRepository} = {userRepository, blacklistRepository};
