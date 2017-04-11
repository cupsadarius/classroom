import {db} from '../db';
import ClassroomValidator from '../db/validators/ClassroomValidator';
import validatorFactory from '../db/validators/ValidatorFactory';
import {ClassroomRepository} from '../db/repositories/ClassroomRepository';
import ClassroomMapping from '../db/mappers/mappings/ClassroomMapping';
import Classroom from '../models/Classroom';

export default class ClassroomService {
    private validator: ClassroomValidator;
    constructor() {
        this.validator = validatorFactory.getValidator('Classroom') as ClassroomValidator;
    }

    public async getAllByAttendee(attendeeId: string) {
        try {
            return await this.getClassroomRepository().filter((classroom: any) => {
                return classroom('teachers').contains(attendeeId).or(classroom('students').contains(attendeeId));
            });
        } catch (e) {
            throw e;
        }
    }

    public async createClassroom(data: ClassroomMapping) {
        try {
            const repo = this.getClassroomRepository();
            const classroom = await repo.getMapper().hydrate(new Classroom(), data);
            if (!this.validator.isValid(classroom)) {
                throw this.validator.getErrors(classroom);
            }
            return await repo.insert(repo.getMapper().dehydrate(classroom));
        } catch (e) {
            throw e;
        }
    }

    public async getById(id: string) {
        try {
            return await this.getClassroomRepository().getById(id);
        } catch (e) {
            throw e;
        }
    }

    public async getByIds(ids: string[]): Promise<Classroom[]> {
        try {
            return await this.getClassroomRepository().getAllByIds(ids) as Promise<Classroom[]>;
        } catch (e) {
            throw e;
        }
    }

    public async update(id: string, data: ClassroomMapping) {
        try {
            const repo = this.getClassroomRepository();
            let classroom = await this.getById(id);
            classroom = await repo.getMapper().hydrate(classroom, data);
            if (!this.validator.isValid(classroom)) {
                throw this.validator.getErrors(classroom);
            }
            return await repo.update({id}, repo.getMapper().dehydrate(classroom));
        } catch (e) {
            throw e;
        }
    }

    private getClassroomRepository(): ClassroomRepository {
        return db.getRepo('sessionRepository') as ClassroomRepository;
    }
}

export const classroomService = new ClassroomService();