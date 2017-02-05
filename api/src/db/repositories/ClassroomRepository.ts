import BaseRepository from './BaseRepository';

export class ClassroomRepository extends BaseRepository {
    constructor() {
        super('classrooms');
    }
}

export const classroomRepository = new ClassroomRepository();
