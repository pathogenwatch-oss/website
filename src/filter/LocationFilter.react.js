import React from 'react';
import { connect } from 'react-redux';

import { updateFilter } from './actions';

const LocationFilter = React.createClass({

  propTypes: {
    location: React.PropTypes.object.isRequired,
    updateFilter: React.PropTypes.func.isRequired,
  },

  componentDidUpdate(previous) {
    if (previous.location !== this.props.location) {
      this.props.updateFilter(this.props.location);
    }
  },

  render() {
    return null;
  },

});

function mapStateToProps(state) {
  return {
    location: state.location,
  };
}

function mapDispatchToProps(dispatch, { stateKey, filters }) {
  return {
    updateFilter: ({ query }) => filters.forEach(({ queryKey, key }) => {
      if (!queryKey) return;
      dispatch(updateFilter(stateKey, { key }, query[queryKey]));
    }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationFilter);
