var React = require('react');
var DEFAULT = require('../defaults');

var CollectionTree = require('./CollectionTree.react');
var SpeciesSubtree = require('./SpeciesSubtree.react');

var SpeciesSubtreeStore = require('../stores/SpeciesSubtreeStore');
var SpeciesSubtreeActionCreators = require('../actions/SpeciesTreeActionCreators');

var MiddleContent = React.createClass({

  speciesSubtreeElements: [],

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      activeAnalysisTreeId: null
    };
  },

  componentWillMount: function () {
    this.setState({
      activeAnalysisTreeId: 'CORE_TREE_RESULT_e0ce1b47-9928-43fb-9a38-981813b609bc'
    });
    this.createSpeciesSubtreeElements();
  },

  componentDidMount: function () {
    SpeciesSubtreeStore.addChangeListener(this.onSpeciesSubtreeChange);
  },

  onSpeciesSubtreeChange: function () {
    this.setState({
      activeAnalysisTreeId: SpeciesSubtreeStore.getActiveSpeciesSubtreeId()
    });
  },

  createSpeciesSubtreeElements: function () {
    var speciesSubtrees = SpeciesSubtreeStore.getSpeciesSubtrees();
    var speciesSubtreeIds = Object.keys(speciesSubtrees);

    speciesSubtreeIds.forEach(function (speciesSubtreeId) {
      this.speciesSubtreeElements[speciesSubtreeId] = (
        <SpeciesSubtree treeId={speciesSubtreeId} key={speciesSubtreeId} />
      );
    }.bind(this));
  },

  getSpeciesSubtreeElement: function () {
    var speciesSubtreeElement = this.speciesSubtreeElements[this.state.activeAnalysisTreeId];

    if (speciesSubtreeElement) {
      return speciesSubtreeElement;
    }

    return null;
  },

  render: function () {
    if (this.state.activeAnalysisTreeId === 'CORE_TREE_RESULT_e0ce1b47-9928-43fb-9a38-981813b609bc') {
      return (
        <CollectionTree
          width={this.props.width}
          height={this.props.height} />
      );

    } else {
      return this.getSpeciesSubtreeElement();
    }
  }
});

module.exports = MiddleContent;
