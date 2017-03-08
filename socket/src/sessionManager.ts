import Session from './models/Session';

export class SessionManager {
    sessions: Session[];

    constructor() {
        this.sessions = [];
    }

    public createSession(id: string) {
        if (!this.sessionExists(id)) {
            const session = new Session();
            session.setId(id);
            this.sessions.push(session);
        }
    }

    public getSession(sessionId: string) {
        return this.sessions.filter(session => session.getId() === sessionId).pop();
    }

    public addParticipant(sessionId: string, participantId: string, socket: SocketIO.Socket) {
        this.getSession(sessionId).addParticipant({id: participantId, socket: participant});
    }

    public sessionExists(sessionId: string): boolean {
        return Boolean(this.sessions.filter(item => item.getId() === sessionId).length);
    }

}

export default new SessionManager();