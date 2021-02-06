import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { AutoSizer } from 'react-virtualized';

const DELAY = 64;
const MIN_WIDTH = 240;
const MIN_HEIGHT = 160;

export default class extends React.Component {
  static displayName = 'AutoSizer'

  static propTypes = {
    children: PropTypes.elementType,
    component: PropTypes.elementType,
    minHeight: PropTypes.number,
    minWidth: PropTypes.number,
  }

  static defaultProps = {
    minHeight: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
  }

  state = {
    height: 0,
    width: 0,
  }

  renderComponent(component, props) {
    const { width, height } = this.state;
    if (height && width) {
      return React.createElement(component, { width, height, ...props });
    }
    return null;
  }

  render() {
    const { children, component = children, minWidth, minHeight, ...rest } = this.props;
    return (
      <AutoSizer
        {...rest}
        onResize={
          debounce(
            ({ width, height }) => this.setState({
              width: Math.max(minWidth, width),
              height: Math.max(minHeight, height),
            }),
            DELAY
          )
        }
      >
        { () => this.renderComponent(component, rest) }
      </AutoSizer>
    );
  }
}
