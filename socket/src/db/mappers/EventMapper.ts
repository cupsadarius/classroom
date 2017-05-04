import Event from '../../models/Event';
import EventMapping from './mappings/EventMapping';
import {MapperInterface} from './MapperInterface';

export default class EventMapper implements MapperInterface<Event, EventMapping> {
    public hydrate(event: Event, data: EventMapping) {
        event.setId(data.id || event.getId());
        event.setSessionId(data.sessionId || event.getSessionId());
        event.setSlideId(data.slideId || event.getSlideId());
        event.setUserId(data.userId || event.getUserId());
        event.setRevision(!isNaN(data.revision) ? data.revision : event.getRevision());
        event.setType(data.type || event.getType());
        event.setData(data.data || event.getData());

        return event;
    }

    public dehydrate(event: Event) {
        const mapping = new EventMapping();
        mapping.id = event.getId();
        mapping.sessionId = event.getSessionId();
        mapping.slideId = event.getSlideId() || '';
        mapping.userId = event.getUserId();
        mapping.revision = event.getRevision();
        mapping.type = event.getType();
        mapping.data = event.getData();

        return mapping;
    }
}