/* @flow */
import BasePage, {React} from './BasePage.jsx';
import {createStore} from '../stores/MultiStore.js';
import {createStore as createCategoryStore} from '../stores/CategoryStore.js';
import {createStore as createLessonStore} from '../stores/LessonStore.js';
import Lesson from '../models/Lesson.js';
import LessonActions from '../actions/LessonActions.js';
import CategoriesActions from '../actions/CategoriesActions.js';
import LessonsTable from '../components/lessons/LessonsTable.jsx';
import LessonForm from '../components/lessons/LessonForm.jsx';
import Sidebar from '../components/Sidebar.jsx';

export default class LessonsPage extends BasePage {

  createStore() {
    return createStore({
      categories: createCategoryStore('categories'),
      lessons: createLessonStore('lessons'),
    });
  }

  componentDidMount() {
    CategoriesActions.loadCategories();
    LessonActions.loadLessons();
  }

  selectLesson(lesson: Lesson) {
    LessonActions.selectLesson(lesson);
  }

  deleteLesson(lessonId: string) {
    LessonActions.deleteLesson(lessonId);
  }

  saveLesson(lesson: Lesson) {
    LessonActions.saveLesson(lesson);
  }

  render(): React.Element {
    return (
      <div className="row">
        <div className="col-xs-2 sidebar"><Sidebar/></div>
        <div className="col-xs-10 main lessonsContainer">
          <div className="row">
            <div className="col-xs-8">
              <h3>Lessons Management</h3>
              <LessonsTable
                lessons={this.state.lessons.lessons}
                selectLesson={this.selectLesson.bind(this)}
                deleteLesson={this.deleteLesson.bind(this)}
              />
            </div>
            <div className="col-xs-4">
              <h3>{`${this.state.lessons.selectedLesson.id ? 'Edit' : 'Add new'} lesson`}</h3>
              <LessonForm
                lesson={this.state.lessons.selectedLesson}
                categories={this.state.categories.categories}
                save={this.saveLesson.bind(this)}
                errors={this.state.lessons.errors}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}