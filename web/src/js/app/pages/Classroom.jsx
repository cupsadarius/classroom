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
      <div className="row classroom">
        <div className="col-md-2 sidebar"></div>
        <div className="col-md-10 col-md-offset-2 tools">
          tools
        </div>
        <div className="col-md-10 col-md-offset-2 canvas">
          container
        </div>
        <div className="col-md-10 col-md-offset-2 navigation">
          botom bar
        </div>
      </div>
    );
  }
}
