/* @flow */
import BasePage, {React} from './BasePage.jsx';

export default class SessionsPage extends BasePage {
  render(): React.Element {
    return (
      <div className="row">
        <div className="col-md-12">{this.props.params.id}</div>
      </div>
    );
  }
}