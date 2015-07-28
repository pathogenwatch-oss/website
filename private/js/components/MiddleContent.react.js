var React = require('react');
var DEFAULT = require('../defaults');

var SpeciesSubtree = require('./SpeciesSubtree.react');
var SpeciesSubtreeStore = require('../stores/SpeciesSubtreeStore');
var SpeciesSubtreeActionCreators = require('../actions/SpeciesTreeActionCreators');
var UploadedCollectionStore = require('../stores/UploadedCollectionStore');

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
      activeAnalysisTreeId: SpeciesSubtreeStore.getActiveSpeciesSubtreeId()
    });
    this.createSpeciesSubtreeElements();
  },

  componentDidMount: function () {
    SpeciesSubtreeStore.addChangeListener(this.onSpeciesSubtreeChange);
  },

  componentWillUnmount: function () {
    SpeciesSubtreeStore.removeChangeListener(this.onSpeciesSubtreeChange);
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
    return this.getSpeciesSubtreeElement();
  }
});

module.exports = MiddleContent;
