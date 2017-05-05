/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import Lesson from '../../models/Lesson.js';
import Category from '../../models/Category.js';
import Session from '../../models/Session.js';
import dateFormatter from '../../helpers/DateFormatter.js';
type SessionFormProps = {
  session: Session,
  lessons: Lesson[],
  categories: Category[],
  save: (lesson: Lesson) => void,
  errors: ?string,
};
export default class SessionForm extends BaseComponent {

  props: SessionFormProps;

  constructor(props: SessionFormProps) {
    super(props);
    this.state = {
      session: new Session(),
      selectedCategory: null,
    };
  }

  componentWillReceiveProps(newProps: SessionFormProps) {
    this.setState({session: newProps.session});
  }

  saveSession() {
    this.props.save(this.state.session);
  }

  clearForm() {
    this.setState({session: new Session()});
  }

  handleChange(field: string, event: Object) {
    const session = this.state.session;
    if (field === 'startDate') {
      session.setStartDate(new Date(event.target.value));
    }
    if (field === 'endDate') {
      session.setEndDate(new Date(event.target.value));
    }

    this.setState({session});
  }

  handleCategoryChange(event: Object) {
    const newCategoryId = event.target.value;
    const selectedCategory = this.props.categories.filter(category => category.id === newCategoryId).pop();
    this.setState({selectedCategory});
  }

  handleLessonChange(event: Object) {
    const newLessonId = event.target.value;
    const session = this.state.session;
    session.lesson = this.props.lessons.filter(lesson => lesson.id === newLessonId).pop();
    this.setState({session});
  }

  getCategoryRows() {
    return this.props.categories ? this.props.categories.map(category => {
      return <option value={category.getId()} key={category.getId()}>{category.getName()}</option>;
    }) : '';
  }

  getLessonRows() {
    const selectedCategory = this.state.selectedCategory || this.state.session.lesson && this.state.session.lesson.category;
    return this.props.lessons && selectedCategory ? this.props.lessons.filter(lesson => lesson.category ? lesson.category.id === selectedCategory.id : false).map(lesson => {
      return <option value={lesson.getId()} key={lesson.getId()}>{lesson.getTitle()}</option>;
    }) : '';
  }

  render(): React.Element {
    const selectedCategory = this.state.selectedCategory || this.state.session.lesson && this.state.session.lesson.category;
    return (
      <div className="lessonForm">
        <form>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input type="date" className="form-control" id="startDate" placeholder="Start Date"
                   value={dateFormatter.formatDateShort(this.state.session.startDate)}
                   onChange={this.handleChange.bind(this, 'startDate')}/>
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input type="date" className="form-control" id="endDate" placeholder="End Date"
                   value={dateFormatter.formatDateShort(this.state.session.endDate)}
                   onChange={this.handleChange.bind(this, 'endDate')}/>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select className="form-control" name="category" id="category"
                    value={selectedCategory ? selectedCategory.getId() : ''}
                    onChange={this.handleCategoryChange.bind(this)}>
              {this.getCategoryRows()}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="lesson">Lesson</label>
            <select className="form-control" name="lesson" id="lesson"
                    value={this.state.session.lesson ? this.state.session.lesson.getId() : ''}
                    onChange={this.handleLessonChange.bind(this)}>
              {this.getLessonRows()}
            </select>
          </div>
          <div className="form-group">
            <button type="button" className="col-xs-5 btn btn-primary" onClick={this.saveSession.bind(this)}>Save
            </button>
            <button type="button" className="col-xs-5 col-xs-offset-2 btn btn-default"
                    onClick={this.clearForm.bind(this)}>Clear
            </button>
          </div>
        </form>
        <div className="clearfix"></div>
        <div className="errors">
          {this.props.errors}
        </div>
      </div>
    );
  }
}
