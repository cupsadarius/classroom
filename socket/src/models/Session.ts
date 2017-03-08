import BaseModel from './BaseModel';

export default class Session extends BaseModel {
    protected participants: {id: string, socket: SocketIO.Socket}[];

    constructor() {
        super();
        this.participants = [];
    }

    public addParticipant(participant: {id: string, socket: SocketIO.Socket}) {
        this.participants.push(participant);
    }
}