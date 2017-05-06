/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import User from '../models/User.js';
import {
  ParticipantJoin,
  ChatMessage,
  SlideChange,
  PencilDrawing,
  EraserDrawing,
  LineDrawing,
  RectangleDrawing,
  HighlighterDrawing,
} from '../events/SocketEvents.js';

export type InstanceStoreState = {
  sessionId: string;
  teachers: User[];
  students: User[];
  chat: {user: string, message: string}[],
  slides: {id: string, drawings: Object[], texts: Object[]}[];
  activeTab: string,
  activeSlide: number,
  activeTool: string,
  activeColor: string
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
      slides: [],
      activeTab: 'attendees',
      activeSlide: 0,
      activeTool: 'none',
      activeColor: '#000000',
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

  onChangeColorEvent(event: {color: string}) {
    const state = this.getState();
    state.activeColor = event.color;
    this.update(state);
    this.emitChange();
  }

  onChangeToolEvent(event: {tool: string}) {
    const state = this.getState();
    state.activeTool = event.tool;
    this.update(state);
    this.emitChange();
  }

  onPencilDrawing(event: PencilDrawing) {
    this.addDrawing(event);
  }

  onEraserDrawing(event: EraserDrawing) {
    this.addDrawing(event);
  }

  onLineDrawing(event: LineDrawing) {
    this.addDrawing(event);
  }

  onRectangleDrawing(event: RectangleDrawing) {
    this.addDrawing(event);
  }

  onOutlineRectangleDrawing(event: RectangleDrawing) {
    this.addDrawing(event);
  }

  onHighlighterDrawing(event: HighlighterDrawing) {
    this.addDrawing(event);
  }

  addDrawing(event: LineDrawing | EraserDrawing | PencilDrawing | RectangleDrawing | HighlighterDrawing) {
    const state = this.getState();
    if (!state.slides.filter(slide => slide.id === event.slideId).length) {
      state.slides.push({
        id: event.slideId,
        drawings: [],
        texts: [],
      });
    }
    state.slides = state.slides.map(slide => {
      if (slide.id !== event.slideId) {
        return slide;
      }
      slide.drawings.push({...event.data, type: event.type});
      return slide;
    });
    this.update(state);
    this.emitChange();
  }
}

export let createStore = generateCreateStore(InstanceStore);
