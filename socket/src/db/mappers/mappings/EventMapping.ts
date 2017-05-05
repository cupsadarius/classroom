export default class EventMapping {
    public id: string;
    public sessionId: string;
    public slideId: string;
    public userId: string;
    public revision: number;
    public type: string;
    public data: {[key: string]: any};
    public persistenceLevel: (0 | 1 | 2);
}