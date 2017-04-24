/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import Lesson from '../../models/Lesson.js';
import Category from '../../models/Category.js';
import {API_BASE_URL} from '../../api/BaseApi.js';
type LessonFormProps = {
  lesson: Lesson,
  categories: Category[],
  save: (lesson: Lesson) => void,
  errors: ?string,
};
export default class LessonForm extends BaseComponent {

  props: LessonFormProps;

  constructor(props: LessonFormProps) {
    super(props);
    this.state = {
      lesson: new Lesson(),
    };
  }

  componentWillReceiveProps(newProps: LessonFormProps) {
    this.setState({lesson: newProps.lesson});
  }

  saveLesson() {
    this.props.save(this.state.lesson);
  }

  clearForm() {
    this.setState({lesson: new Lesson()});
  }

  handleChange(field: string, event: Object) {
    const lesson = this.state.lesson;
    lesson[`${field}`] = event.target.value;
    this.setState({lesson});
  }

  handleCategoryChange(event: Object) {
    const newCategoryId = event.target.value;
    const lesson = this.state.lesson;
    lesson.category = this.props.categories.filter(category => category.id === newCategoryId).pop();
    this.setState({lesson});
  }

  handleSlideChange(index: number, event: Object) {
    const lesson = this.state.lesson;
    lesson.slides[index] = event.target.files[0];
    this.setState({lesson});
  }

  getCategoryRows() {
    return this.props.categories ? this.props.categories.map(category => {
        return <option value={category.getId()} key={category.getId()}>{category.getName()}</option>;
      }) : '';
  }

  getSlidesInputs() {
    return this.state.lesson.slides ? this.state.lesson.slides.map(
        (slide, index) => (
          slide.id ?
            <div key={index} style={{marginBottom: '10px'}}>
              <img src={`${API_BASE_URL}${slide.path}`} className="img-responsive"/>
            </div> :
            <div className="form-control" key={index}>
              <input
                type="file"
                style={{float: 'left'}}
                id={`slide_${index}`}
                name="slide"
                onChange={this.handleSlideChange.bind(this, index)}
              />
              <span className="actionButton" style={{marginRight: '-2px'}}>
              <i className="fa fa-minus-circle"
                 onClick={this.removeSlideInput.bind(this, index)}/>
            </span>
            </div>
        )
      ) : '';
  }

  addSlideInput() {
    const lesson = this.state.lesson;
    lesson.slides.push({});
    this.setState({lesson});
  }

  removeSlideInput(index: number) {
    const lesson = this.state.lesson;
    lesson.slides.splice(index, 1);
    this.setState({lesson});
  }

  render(): React.Element {
    return (
      <div className="lessonForm">
        <form>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" className="form-control" id="title" placeholder="Title"
                   value={this.state.lesson.title} onChange={this.handleChange.bind(this, 'title')}/>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Description</label>
            <textarea className="form-control" id="description" placeholder="Description"
                      value={this.state.lesson.description} onChange={this.handleChange.bind(this, 'description')}/>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select className="form-control" name="category" id="category"
                    value={this.state.lesson.category ? this.state.lesson.category.getId() : ''}
                    onChange={this.handleCategoryChange.bind(this)}>
              {this.getCategoryRows()}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="slides">Slides</label>
            <span className="actionButton"><i className="fa fa-plus-circle"
                                              onClick={this.addSlideInput.bind(this)}/></span>
            {this.getSlidesInputs()}
          </div>
          <div className="form-group">
            <button type="button" className="col-xs-5 btn btn-primary" onClick={this.saveLesson.bind(this)}>Save
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
