/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import {API_BASE_URL} from '../../api/BaseApi.js';
import Lesson from '../../models/Lesson.js';
import User from '../../models/User.js';
import SocketActions from '../../actions/SocketActions.js';
import Whiteboard from './Whiteboard.jsx';
const BASE_PAGE_WIDTH = 1000; // The basis width used for coordinates on the page

export type BoardProps = {
  lesson: Lesson,
  board: {
    chat: { user: string, message: string }[],
    slides: { [key: string]: { drawings: Object[], texts: Object[] } };
    activeSlide: number,
  },
  sessionId: string,
  user: User,
  sidebarWidth: number,
}

export type BoardState = {
  windowWidth: number,
  windowHeight: number,
  sidebarWidth: number,
};

export default class Board extends BaseComponent {
  props: BoardProps;
  state: BoardState;
  constructor(props: BoardProps) {
    super(props);

    this.state = {
      windowWidth: $(window).innerWidth(),
      windowHeight: $(window).innerHeight(),
      sidebarWidth: $('.sidebar').innerWidth(),
    };
  }

  shouldComponentUpdate(newProps: BoardProps, newState: BoardState) {
    if (
      newProps.board.chat.length === this.props.board.chat.length &&
      newProps.board.activeSlide === this.props.board.activeSlide &&
      newProps.sidebarWidth === this.props.sidebarWidth &&
      newProps.sidebarWidth === newState.sidebarWidth
    ) {
      return false;
    }

    return true;
  }

  componentDidMount() {
    this._handleResizeFunction = () => this.handleResize(); // Bind "this" and store this function to be able to remove it later (function.bind(this) would create a new reference every time, that can not be removed later on)

    window.addEventListener('resize', this._handleResizeFunction);

    this.handleResize();
  }

  handleResize() {
    let innerWindowWidth = $(window).innerWidth();
    let innerWindowHeight = $(window).innerHeight();
    let sidebarWidth = $('.sidebar').innerWidth() || this.props.sidebarWidth;
    if (innerWindowWidth !== this.state.windowWidth) {
      this.setState({windowWidth: innerWindowWidth});
    }
    if (innerWindowHeight !== this.state.windowHeight) {
      this.setState({windowHeight: innerWindowHeight});
    }
    if (sidebarWidth !== this.state.sidebarWidth) {
      this.setState({sidebarWidth});
    }
  }

  changeSlide(direction: (1 | -1)) {
    SocketActions.changeSlide(this.props.sessionId, this.props.user, direction);
  }

  render(): React.Component {
    const lesson = this.props.lesson;
    const activeSlide = this.props.board.activeSlide;
    let sidebarWidth = this.state.sidebarWidth;
    let windowWidth = this.state.windowWidth;
    let windowHeight = this.state.windowHeight - 130;
    let pageWidth = (windowWidth - sidebarWidth);
    let pageScaleFactor = pageWidth / BASE_PAGE_WIDTH;

    return (
      <div className="col-md-offset-2 col-md-10 row">
        <div className="col-md-10 tools" style={{left: `${sidebarWidth}px`}}>
          tools
        </div>
        <div className="col-md-10 canvas" style={{left: `${sidebarWidth}px`, maxHeight: `${windowHeight}px`}}>
          <img src={`${API_BASE_URL}${lesson.getSlides()[activeSlide].path}`}
               className="img-responsive"/>
          <Whiteboard scaleFactor={pageScaleFactor}/>
        </div>
        <div className="col-md-10 navigation" style={{left: `${sidebarWidth}px`}}>
          <div className="col-md-8">
            <h4>{lesson.getTitle()}</h4>
          </div>
          <div className="col-md-4 text-center">
            <h4>
              {!activeSlide ? <span style={{width: '18px'}}>&nbsp;</span> :
                <i className="fa fa-chevron-circle-left orange" onClick={this.changeSlide.bind(this, -1)}/>}
              <span className="slide-position">
                {activeSlide + 1} / {lesson.getSlides().length}
              </span>
              {activeSlide + 1 === lesson.getSlides().length ? <span style={{width: '18px'}}>&nbsp;</span> :
                <i className="fa fa-chevron-circle-right orange" onClick={this.changeSlide.bind(this, 1)}/>}
            </h4>
          </div>
        </div>
      </div>
    );
  }
}
