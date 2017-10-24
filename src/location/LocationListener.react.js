import React from 'react';
import { connect } from 'react-redux';

const LocationListener = createClass({

  propTypes: {
    query: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  },

  componentDidUpdate(previous) {
    if (previous.query !== this.props.query) {
      this.props.onChange(this.props.query);
    }
  },

  render() {
    return null;
  },

});

function mapStateToProps({ location }) {
  return {
    query: location.query,
  };
}

function mapDispatchToProps(dispatch, { update }) {
  return {
    onChange: query => dispatch(update(query)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationListener);
