import BaseRepository from './BaseRepository';
import ClassroomMapper from '../mappers/ClassroomMapper';
import mapperFactory from '../mappers/MapperFactory';
import Classroom from '../../models/Classroom';
import ClassroomMapping from '../mappers/mappings/ClassroomMapping';

export class ClassroomRepository extends BaseRepository {

    private mapper: ClassroomMapper;
    constructor() {
        super('classrooms');
        this.mapper = mapperFactory.getMapper('Classroom') as ClassroomMapper;
    }


    public async filter(filter: {[key: string]: any}) {
        try {
            const data: ClassroomMapping[] = await super.filter(filter) as ClassroomMapping[];
            const classrooms = data.map(async item => await this.mapper.hydrate(new Classroom(), item));
            return Promise.all(classrooms);
        } catch (e) {
            throw e;
        }
    }

    public async getById(id: string): Promise<Classroom> {
        try {
            const data = await super.get(id) as ClassroomMapping;
            return await this.mapper.hydrate(new Classroom(), data);
        } catch (e) {
            throw e;
        }
    }

    public async getByIds(ids: string[]) {
        try {
            const data: ClassroomMapping[] = await super.getAllByIds(ids) as ClassroomMapping[];
            const classrooms = data.map(async item => await this.mapper.hydrate(new Classroom(), item));
            return Promise.all(classrooms);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Returns an instance of the ClassroomMapper.
     */
    public getMapper(): ClassroomMapper {
        return this.mapper;
    }

}

export const classroomRepository = new ClassroomRepository();
