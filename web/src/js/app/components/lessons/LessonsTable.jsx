/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import Lesson from '../../models/Lesson.js';

type LessonsTableProps = {
  lessons: Lesson[],
  selectLesson: (lesson: Lesson) => void,
  deleteLesson: (lessonId: String) => void,
};
export default class LessonsTable extends BaseComponent {
  props: LessonsTableProps;

  getLessonRows() {
    return this.props.lessons ? this.props.lessons.map((lesson, index) => {
        return (
          <tr key={lesson.getId()} className="text-center">
            <td>{index + 1}</td>
            <td>{lesson.getTitle()}</td>
            <td>{lesson.getDescription()}</td>
            <td>{lesson.getSlides().length}</td>
            <td>{lesson.getCategory().getName()}</td>
            <td onClick={() => this.props.selectLesson(lesson)}><i className="fa fa-edit"></i></td>
            <td onClick={() => this.props.deleteLesson(lesson.getId())}><i className="fa fa-remove"></i></td>
          </tr>
        )
      }) : null;
  }

  render(): React.Element {
    const lessonRows = this.getLessonRows();
    return (
      <table className="table table-responsive table-striped">
        <thead>
        <tr>
          <th className="text-center text-capitalize">Index</th>
          <th className="text-center text-capitalize">Title</th>
          <th className="text-center text-capitalize">Description</th>
          <th className="text-center text-capitalize">No Slides</th>
          <th className="text-center text-capitalize">Category</th>
          <th colSpan="2" className="text-center text-capitalize">Actions</th>
        </tr>
        </thead>
        <tbody className="tab-content">
        {lessonRows}
        </tbody>
      </table>
    )
  }
}