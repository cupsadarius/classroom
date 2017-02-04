/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import Category from '../../models/Category.js';

type CategoriesTableProps = {
  categories: Category[],
  selectCategory: (category: Category) => void,
  deleteCategory: (categoryId: String) => void,
};

export default class CategoriesTable extends BaseComponent {
  props: CategoriesTableProps;

  getCategoryRows() {
    return this.props.categories ? this.props.categories.map((category, index) => {
      return (
        <tr key={category.getId()} className="text-center">
          <td>{index + 1}</td>
          <td>{category.getName()}</td>
          <td>{category.getDescription()}</td>
          <td onClick={() => this.props.selectCategory(category)}><i className="fa fa-edit"></i></td>
          <td onClick={() => this.props.deleteCategory(category.getId())}><i className="fa fa-remove"></i></td>
        </tr>
      )
      }) : null;
  }

  render(): React.Element {
    const categoryRows = this.getCategoryRows();
    return (
      <table className="table table-responsive table-striped">
        <thead>
        <tr>
          <th className="text-center text-capitalize">Index</th>
          <th className="text-center text-capitalize">Name</th>
          <th className="text-center text-capitalize">Description</th>
          <th colSpan="2" className="text-center text-capitalize">Actions</th>
        </tr>
        </thead>
        <tbody className="tab-content">
        {categoryRows}
        </tbody>
      </table>
    )
  }
}