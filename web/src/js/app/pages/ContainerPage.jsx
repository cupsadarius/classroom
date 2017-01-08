/* @flow */

import BasePage, {React} from './BasePage.jsx';
import Navigation from '../components/Navigation.jsx';

export default class ContainerPage extends BasePage {
  props: {
    children: React.Component
  };

  render(): React.Component {
    return(
      <div>
        <Navigation/>
            <div className="container-fluid content">
              {this.props.children}
            </div>
      </div>
    );
  }
}