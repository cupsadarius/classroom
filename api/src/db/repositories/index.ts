import {userRepository} from './UserRepository';
import {blacklistRepository} from './BlacklistRepository';
import {attendeeRepository} from './AttendeeRepository';
import {lessonRepository} from './LessonRepository';
import {categoryRepository} from './CategoryRepository';
import BaseRepository from './BaseRepository';

export let repos: {[key: string]: BaseRepository} = {
    userRepository,
    blacklistRepository,
    attendeeRepository,
    lessonRepository,
    categoryRepository,
};
