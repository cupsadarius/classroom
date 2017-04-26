import BaseModel from './BaseModel';
import Event from './Event';
import {eventService} from '../services/eventService';
import mapperFactory from '../db/mappers/MapperFactory';
import EventMapper from '../db/mappers/EventMapper';
import EventMapping from '../db/mappers/mappings/EventMapping';

interface Participant {
    id: string;
    socket: SocketIO.Socket;
}

export default class Session extends BaseModel {
    protected participants: Participant[];
    protected revision: number;
    protected closeSession: Function;

    constructor(closeSession: Function) {
        super();
        this.revision = 0;
        this.participants = [];
        this.closeSession = closeSession;
    }

    public async addParticipant(participant: Participant) {
        console.log(participant.id);
        await this.getParticipantUpToDate(participant);
        await this.registerListeners(participant);

        this.participants.push(participant);
        return true;
    }

    private emitToOthers(event: Event) {
        const others = this.participants.filter(participant => participant.id !== event.getUserId());

        for (const key in others) {
            others[key].socket.emit('receive', event);
        }
    }

    private async handleDistributeEvent(event: {}) {
        const convertedEvent = this.convertEvent(event);
        await this.saveEvent(convertedEvent);
        this.emitToOthers(convertedEvent);
    }

    private async saveEvent(event: Event) {
        event.setRevision(this.revision);
        await eventService.saveEvent(event);
        this.revision++;
    }

    private async getParticipantUpToDate(participant: Participant) {
        const events = await eventService.getBySessionId(this.getId());
        const sorted = events.sort((a, b) => a.getRevision() - b.getRevision());
        sorted.forEach((event) => {
            participant.socket.emit('receive', event);
        });
        // if reopened old session update current revision id.
        const lastEvent = sorted.pop();
        if (lastEvent) {
            this.revision = lastEvent.getRevision() > this.revision ? lastEvent.getRevision() : this.revision;
        }
    }

    private async registerListeners(participant: Participant) {
        participant.socket.on('distribute', await this.handleDistributeEvent.bind(this));
        participant.socket.on('disconnect', () => { this.removeParticipant(participant); });
    }

    private removeParticipant(participant: Participant) {
        this.participants = this.participants.filter(item => item.id !== participant.id);
        if (!this.participants.length) {
            this.closeSession(this.getId());
        }
    }

    private convertEvent(data: {}): Event {
        return (mapperFactory.getMapper('Event') as EventMapper).hydrate(new Event(), (data as EventMapping));
    }
}