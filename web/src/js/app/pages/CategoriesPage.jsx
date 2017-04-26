/* @flow */
import BasePage, {React} from './BasePage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import CategoriesActions from '../actions/CategoriesActions.js';
import {createStore} from '../stores/CategoryStore.js';
import CategoriesTable from '../components/categories/CategoriesTable.jsx';
import Category from '../models/Category.js';
import CategoryForm from '../components/categories/CategoryForm.jsx';

export default class CategoriesPage extends BasePage {

  createStore() {
    return createStore('categories');
  }

  componentDidMount() {
    CategoriesActions.loadCategories();
  }

  selectCategory(category: Category) {
    CategoriesActions.selectCategory(category);
  }

  deleteCategory(categoryId: string) {
    CategoriesActions.deleteCategory(categoryId);
  }

  saveCategory(category: Category) {
    CategoriesActions.saveCategory(category);
  }

  render(): React.Element {
    return (
      <div className="row">
        <div className="col-xs-2 sidebar"><Sidebar/></div>
        <div className="col-xs-10 main categoriesContainer">
          <div className="row">
            <div className="col-xs-8">
              <h3>Categories Management</h3>
              <CategoriesTable
                categories={this.state.categories}
                selectCategory={this.selectCategory.bind(this)}
                deleteCategory={this.deleteCategory.bind(this)}
              />
            </div>
            <div className="col-xs-4">
              <h3>{`${this.state.selectedCategory.id ? 'Edit' : 'Add new'} category`}</h3>
              <CategoryForm
                category={this.state.selectedCategory}
                save={this.saveCategory.bind(this)}
                errors={this.state.errors}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
