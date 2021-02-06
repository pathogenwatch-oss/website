import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '../icon-button';
import Fade from '../transitions/Fade.react';

export default class extends React.Component {
  static displayName = 'Search'

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  state = {
    isActive: false,
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isActive !== prevState.isActive) {
      if (this.state.isActive) {
        this.searchInput.focus();
      } else if (this.props.value) {
        this.props.onChange();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <IconButton onClick={() => this.setState({ isActive: !this.state.isActive })}>
          <i className="material-icons">search</i>
        </IconButton>
        <Fade in={this.state.isActive}>
          <input
            className="libmr-search-input"
            type="text"
            placeholder="Search"
            value={this.props.value}
            onChange={event => this.props.onChange(event.target.value)}
            ref={el => { this.searchInput = el; }}
          />
        </Fade>
      </React.Fragment>
    );
  }
}
