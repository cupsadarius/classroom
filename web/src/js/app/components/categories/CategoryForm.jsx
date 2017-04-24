/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import Category from '../../models/Category.js';

export type CategoryFormProps = {
  category: Category,
  save: (category: Category) => void,
  errors: ?string,
};

export default class CategoryForm extends BaseComponent {
  props: CategoryFormProps;

  constructor(props: CategoryFormProps) {
    super(props);
    this.state = {
      category: new Category(),
    };
  }

  componentWillReceiveProps(newProps: CategoryFormProps) {
    this.setState({category: newProps.category});
  }

  saveCategory() {
    this.props.save(this.state.category);
  }

  clearForm() {
    this.setState({category: new Category()});
  }

  handleChange(field: string, event: Object) {
    const category = this.state.category;
    category[`${field}`] = event.target.value;
    this.setState({category});
  }

  render(): React.Component {
    return (
      <div className="categoryForm">
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" placeholder="Name"
                   value={this.state.category.name} onChange={this.handleChange.bind(this, 'name')} />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Description</label>
            <textarea className="form-control" id="description" placeholder="Description"
                   value={this.state.category.description} onChange={this.handleChange.bind(this, 'description')} />
          </div>
          <div className="form-group">
            <button type="button" className="col-xs-5 btn btn-primary" onClick={this.saveCategory.bind(this)}>Save</button>
            <button type="button" className="col-xs-5 col-xs-offset-2 btn btn-default" onClick={this.clearForm.bind(this)}>Clear</button>
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
