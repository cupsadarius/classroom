import {db} from '../db';
import SessionRepository from '../db/repositories/SessionRepository';
import Session from '../models/Session';
import SessionMapping from '../db/mappers/mappings/SessionMapping';
import SessionValidator from '../db/validators/SessionValidator';
import validatorFactory from '../db/validators/ValidatorFactory';
import {classroomService} from './classroomService';

export default class SessionService {
    private validator: SessionValidator;
    constructor() {
        this.validator = validatorFactory.getValidator('Session') as SessionValidator;
    }

    public async createSession(classroomId: string, data: SessionMapping) {
        try {
            const repo = this.getSessionRepository();
            const session = await repo.getMapper().hydrate(new Session(), data);
            if (!this.validator.isValid(session)) {
                throw this.validator.getErrors(session);
            }
            const inserted = await repo.insert(repo.getMapper().dehydrate(session));
            if (inserted) {
                const classroom = await classroomService.getById(classroomId);
                classroom.addSession(session);
                await classroomService.saveClassroom(classroom);
            }

            return inserted;
        } catch (e) {
            throw e;
        }
    }

    public async getAllForClassroom(classroomId: string) {
        try {
            const classroom = await classroomService.getById(classroomId);
            return classroom.getSessions();
        } catch (e) {
            throw e;
        }
    }

    public async getById(id: string) {
        try {
            return await this.getSessionRepository().getById(id);
        } catch (e) {
            throw e;
        }
    }

    public async getByIds(ids: string[]) {
        try {
            return await this.getSessionRepository().getByIds(ids);
        } catch (e) {
            throw e;
        }
    }

    public async update(id: string, data: SessionMapping) {
        try {
            const repo = this.getSessionRepository();
            let session = await this.getById(id);
            session = await repo.getMapper().hydrate(session, data);
            if (!this.validator.isValid(session)) {
                throw this.validator.getErrors(session);
            }
            return await repo.update({id}, repo.getMapper().dehydrate(session));
        } catch (e) {
            throw e;
        }
    }

    public async delete(classroomId: string, id: string) {
        try {
            const deleted = await this.getSessionRepository().delete([id]);
            const classroom = await classroomService.getById(classroomId);
            classroom.removeSessionById(classroom.getId());
            await classroomService.saveClassroom(classroom);

            return deleted;
        } catch (e) {
            throw e;
        }
    }

    private getSessionRepository(): SessionRepository {
        return db.getRepo('sessionRepository') as SessionRepository;
    }
}

export const sessionService = new SessionService();