/* @flow */
import BaseComponent, {React} from '../BaseComponent.jsx';
import {API_BASE_URL} from '../../api/BaseApi.js';
import Lesson from '../../models/Lesson.js';
import SocketActions from '../../actions/SocketActions.js';
import InstanceActions from '../../actions/InstanceActions.js';
import Whiteboard from './Whiteboard.jsx';
import ColorPicker from './ColorPicker.jsx';
import cx from 'classnames';
const BASE_PAGE_WIDTH = 1000; // The basis width used for coordinates on the page

export type BoardProps = {
  lesson: Lesson,
  board: {
    slides: {id: string, drawings: Object[], texts: Object[] }[];
    activeSlide: number,
    activeTool: string,
    activeColor: string,
  },
  sessionId: string,
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
    SocketActions.changeSlide(this.props.sessionId, direction);
  }

  getSlideId(activeSlide: number) {
    return this.props.lesson && this.props.lesson.slides[activeSlide].id;
  }

  changeColor(color: string) {
    InstanceActions.changeColor(color);
  }

  changeTool(tool: string) {
    InstanceActions.changeTool(tool);
  }

  render(): React.Component {
    const lesson = this.props.lesson;
    const activeSlide = this.props.board.activeSlide;
    const activeSlideId = this.getSlideId(activeSlide);
    const activeSlideObject = this.props.board.slides.filter(slide => slide && slide.id === activeSlideId).pop();
    const drawings = activeSlideObject ? activeSlideObject.drawings : [];
    const texts = activeSlideObject ? activeSlideObject.texts : [];
    const sidebarWidth = this.state.sidebarWidth;
    const windowWidth = this.state.windowWidth;
    const windowHeight = this.state.windowHeight - 130;
    const pageWidth = (windowWidth - sidebarWidth);
    const pageScaleFactor = pageWidth / BASE_PAGE_WIDTH;
    const activeTool = this.props.board.activeTool;

    return (
      <div className="col-md-offset-2 col-md-10 row">
        <div className="col-md-10 tools text-center" style={{left: `${sidebarWidth}px`}}>
          <div className="dropdown">
            <button className="btn tool" type="button" id="colorPicker" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="true" style={{color: this.props.board.activeColor}}><i className="fa fa-eyedropper"/>
            </button>
            <div className="dropdown-menu color-picker" aria-labelledby="colorPicker">
              <ColorPicker activeColor={this.props.board.activeColor} changeColor={this.changeColor.bind(this)}/>
            </div>
          </div>
          <button className={cx('btn tool', {active: activeTool === 'pencil'})}
                  onClick={this.changeTool.bind(this, 'pencil')}><i className="fa fa-pencil"/></button>
          <button className={cx('btn tool', {active: activeTool === 'eraser'})}
                  onClick={this.changeTool.bind(this, 'eraser')}><i className="fa fa-eraser"/></button>
          <button className={cx('btn tool', {active: activeTool === 'rectangle'})}
                  onClick={this.changeTool.bind(this, 'rectangle')}><i className="fa fa-square"/></button>
          <button className={cx('btn tool', {active: activeTool === 'rectangle-outline'})}
                  onClick={this.changeTool.bind(this, 'rectangle-outline')}><i className="fa fa-square-o"/></button>
          <button className={cx('btn tool', {active: activeTool === 'line'})}
                  onClick={this.changeTool.bind(this, 'line')}><i className="fa fa-long-arrow-right"/></button>
          {/*<button className={cx('btn tool', {active: activeTool === 'text'})}*/}
                  {/*onClick={this.changeTool.bind(this, 'text')}><i className="fa fa-font"/></button>*/}
          <button className={cx('btn tool', {active: activeTool === 'highlight'})}
                  onClick={this.changeTool.bind(this, 'highlight')}><i className="fa fa-italic"/></button>
        </div>
        <div className="col-md-10 canvas" style={{left: `${sidebarWidth}px`, maxHeight: `${windowHeight}px`}}>
          <img src={`${API_BASE_URL}${lesson.getSlides()[activeSlide].path}`}
               className="img-responsive"/>
          <Whiteboard
            scaleFactor={pageScaleFactor}
            activeSlideId={this.getSlideId(activeSlide)}
            activeTool={this.props.board.activeTool}
            activeColor={this.props.board.activeColor}
            sessionId={this.props.sessionId}
            drawings={drawings}
            texts={texts}
            sidebarWidth={this.props.sidebarWidth}
          />
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
