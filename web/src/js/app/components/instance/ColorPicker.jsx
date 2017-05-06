/* @flow */

import BaseComponent, {React} from '../BaseComponent.jsx';
import cx from 'classnames';
import shortId from 'shortid';
export type ColorPickerProps = {
  activeColor: string;
  changeColor: (color: string) => void;
};

export default class ColorPicker extends BaseComponent {
  props: ColorPickerProps;

  changeColor(color: string) {
    this.props.changeColor(color);
  }

  render(): React.Element {
    const colors = [
      ['#000000', '#ffffff', '#ec008c', '#ed145b', '#920432', '#872109', '#ff764d', '#d43f1c'],
      ['#00aeef', '#00a99d', '#00a651', '#8dc63f', '#fff200', '#f7941d', '#f26522', '#ed1c24'],
      ['#f68e56', '#fbaf5d', '#fff568', '#acd373', '#3cb878', '#1cbbb4', '#12848b', '#448ccb'],
    ];

    let selectedColor = this.props.activeColor;
    let colorTable = colors.map((row) => {
      let colorsRow = row.map((color) => {
        let classes = cx('colorTile', {'active': color === selectedColor});
        return (
          <div
            className={classes}
            style={{backgroundColor: color}}
            onClick={this.changeColor.bind(this, color)}
            key={color}
          ></div>
        );
      });
      return (
        <div key={shortId.generate()}>{colorsRow}</div>
      );
    });
    return (
      <div className="colorTable">
        {colorTable}
      </div>
    );
  }
}
