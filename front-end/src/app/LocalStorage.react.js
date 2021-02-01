
import React from 'react';
import { connect } from 'react-redux';

import { getStoredSelection } from '../genomes/selection/utils';
import { setSelection } from '../genomes/selection/actions';

const Component = React.createClass({

  componentDidMount() {
    getStoredSelection()
      .then(this.props.setSelection);
  },

  render() {
    return null;
  },

});

function mapDispatchToProps(dispatch) {
  return {
    setSelection: (genomes) => dispatch(setSelection(genomes)),
  };
}

export default connect(null, mapDispatchToProps)(Component);
