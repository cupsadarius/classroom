import {userRepository} from './UserRepository';
import {blacklistRepository} from './BlacklistRepository';
import {attendeeRepository} from './AttendeeRepository';
import {lessonRepository} from './LessonRepository';
import {categoryRepository} from './CategoryRepository';
import {classroomRepository} from './ClassroomRepository';
import BaseRepository from './BaseRepository';

export const repos: {[key: string]: BaseRepository} = {
    userRepository,
    blacklistRepository,
    attendeeRepository,
    lessonRepository,
    categoryRepository,
    classroomRepository,
};
