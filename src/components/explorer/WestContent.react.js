import React from 'react';
import { connect } from 'react-redux';

import SpeciesTree from './SpeciesTree.react';
import Subtree from './Subtree.react';

const WestContent = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    subtree: React.PropTypes.string,
  },

  render() {
    const { subtree, width, height } = this.props;

    const TreeComponent = subtree ? Subtree : SpeciesTree;

    return (
      <TreeComponent dimensions={{ width, height }} />
    );
  },
});

export default connect(({ display }) => display)(WestContent);
