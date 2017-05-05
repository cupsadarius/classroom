/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import User from '../models/User.js';
import {ParticipantJoin, ChatMessage, SlideChange} from '../events/SocketEvents.js';

export type InstanceStoreState = {
  sessionId: string;
  teachers: User[];
  students: User[];
  chat: {user: string, message: string}[],
  slides: {[key: string]: {drawings: Object[], texts: Object[]}};
  activeTab: string,
  activeSlide: number,
}

export class InstanceStore extends BaseStore {
  state: InstanceStoreState;

  constructor() {
    super();

    this.state = {
      sessionId: '',
      teachers: [],
      students: [],
      chat: [],
      slides: {},
      activeTab: 'attendees',
      activeSlide: 0,
    };
  }

  onParticipantJoin(event: ParticipantJoin) {
    const state = this.getState();
    const teacherExists = this.state.teachers && this.state.teachers.filter(teacher => teacher.id === event.userId).length;
    const studentExists = this.state.students && this.state.students.filter(student => student.id === event.userId).length;
    if (teacherExists || studentExists) {
      return;
    }
    const isTeacher = event.data.participant.roles.indexOf('ROLE_TEACHER') >= 0;
    state.sessionId = state.sessionId ? state.sessionId : event.sessionId;
    if (isTeacher) {
      state.teachers.push(new User(event.data.participant));
    } else {
      state.students.push(new User(event.data.participant));
    }

    this.update(state);
    this.emitChange();
  }

  onTabChangeEvent(event: {activeTab: string}) {
    const state = this.getState();
    state.activeTab = event.activeTab;
    this.update(state);
    this.emitChange();
  }

  onChatMessage(event: ChatMessage) {
    const state = this.getState();
    state.chat.push(event.data);
    this.update(state);
    this.emitChange();
  }

  onSlideChange(event: SlideChange) {
    const state = this.getState();
    state.activeSlide += event.data.direction;
    this.update(state);
    this.emitChange();
  }
}

export let createStore = generateCreateStore(InstanceStore);
