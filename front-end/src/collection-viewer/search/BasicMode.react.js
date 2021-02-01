import React from 'react';
import { connect } from 'react-redux';

import Switch from '../../components/switch';

import { isExactMatch } from './selectors';

import { searchExactMatchToggled } from './thunks';

const BasicMode = React.createClass({

  render() {
    return (
      <section onSubmit={e => e.preventDefault()}>
        <Switch
          lhs
          id="search-exact-match"
          checked={this.props.isExact}
          onChange={this.props.toggleExactMatch}
        >
          Exact Match
        </Switch>
      </section>
    );
  },

});

function mapStateToProps(state) {
  return {
    isExact: isExactMatch(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleExactMatch: () => dispatch(searchExactMatchToggled()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicMode);
