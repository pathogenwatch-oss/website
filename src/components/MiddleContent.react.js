import React from 'react';

import Subtree from './Subtree.react';
import SubtreeStore from '../stores/SubtreeStore';

const MiddleContent = React.createClass({

  SubtreeElements: {},

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      activeAnalysisTreeId: null,
    };
  },

  componentWillMount: function () {
    this.setState({
      activeAnalysisTreeId: SubtreeStore.getActiveSubtreeId(),
    });
    this.createSubtreeElements();
  },

  componentDidMount: function () {
    SubtreeStore.addChangeListener(this.onSubtreeChange);
  },

  componentWillUnmount: function () {
    SubtreeStore.removeChangeListener(this.onSubtreeChange);
  },

  onSubtreeChange: function () {
    this.setState({
      activeAnalysisTreeId: SubtreeStore.getActiveSubtreeId(),
    });
  },

  createSubtreeElements: function () {
    var Subtrees = SubtreeStore.getSubtrees();
    var SubtreeIds = Object.keys(Subtrees);

    SubtreeIds.forEach((SubtreeId) => {
      this.SubtreeElements[SubtreeId] = (
        <Subtree treeId={SubtreeId} key={SubtreeId} />
      );
    });
  },

  getSubtreeElement: function () {
    var SubtreeElement = this.SubtreeElements[this.state.activeAnalysisTreeId];

    if (SubtreeElement) {
      return SubtreeElement;
    }

    return null;
  },

  render: function () {
    return this.getSubtreeElement();
  }
});

module.exports = MiddleContent;
