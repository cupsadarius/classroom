import BaseModel from './BaseModel';
import Session from './Session';
import Attendee from './Attendee';

export default class Classroom extends BaseModel {
    protected teachers: Attendee[];
    protected students: Attendee[];
    protected sessions: Session[];

}
