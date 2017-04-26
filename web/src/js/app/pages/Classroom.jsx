/* @flow */
import BasePage, {React} from './BasePage.jsx';
import SocketActions from '../actions/SocketActions.js';

export default class SessionsPage extends BasePage {

  componentDidMount() {
    SocketActions.connect(this.props.params.id);
  }

  componentWillUnmount() {
    SocketActions.disconnect();
  }
  render(): React.Element {
    return (
      <div className="row">
        <div className="col-md-12">{this.props.params.id}</div>
      </div>
    );
  }
}
