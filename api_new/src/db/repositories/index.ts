import BaseRepository from './BaseRepository';
import {userRepository} from './UserRepository';
import {attendeeRepository} from './AttendeeRepository';
import {blacklistRepository} from './BlacklistRepository';
import {categoryRepository} from './CategoryRepository';
import {classroomRepository} from './ClassroomRepository';
import {lessonRepository} from './LessonRepository';

export const repos: {[key: string]: BaseRepository} = {
    userRepository,
    attendeeRepository,
    blacklistRepository,
    categoryRepository,
    classroomRepository,
    lessonRepository,
};
