import {userRepository} from './UserRepository';
import BaseRepository from './BaseRepository';

export let repos: {[key: string]: BaseRepository} = {userRepository};
