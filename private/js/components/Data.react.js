var React = require('react');
var Table = require('./Table.react');
var Timeline = require('./Timeline.react');
var Filters = require('./Filters.react');
var AboutProject = require('./AboutProject.react');
var DownloadProject = require('./DownloadProject.react');

var Data = React.createClass({

  propTypes: {
    isolates: React.PropTypes.object.isRequired,
    shortId: React.PropTypes.string.isRequired,
    metadata: React.PropTypes.object.isRequired,
    filteredTableData: React.PropTypes.object.isRequired,
    colourDataByDataField: React.PropTypes.string,
    layoutSouthHeight: React.PropTypes.number.isRequired,
    onTimelineFilterChange: React.PropTypes.func.isRequired,
    layoutNavigation: React.PropTypes.string.isRequired
  },

  getTimeline: function () {
    if (this.props.filterStartDate && this.props.filterEndDate) {
      return (
        <Timeline
          data={this.props.isolates}
          height={this.props.layoutSouthHeight}
          colourDataByDataField={this.props.colourDataByDataField}
          onTimelineFilterChange={this.props.onTimelineFilterChange}
          filterStartDate={this.props.filterStartDate}
          filterEndDate={this.props.filterEndDate} />
      );
    }

    return null;
  },

  render: function () {

    var sectionStyle = {
      width: '100%',
      height: '100%'
    };

    var showStyle = {
      display: 'block',
      width: '100%',
      height: '100%'
    };

    var hideStyle = {
      display: 'none'
    };

    return (
      <section style={sectionStyle}>

        <div style={ this.props.layoutNavigation === 'table' ? showStyle : hideStyle }>

          <Table
            data={this.props.isolates}
            filteredTableData={this.props.filteredTableData} />

        </div>

        <div style={ this.props.layoutNavigation === 'timeline' ? showStyle : hideStyle }>
          { this.getTimeline() }
        </div>

        <div style={ this.props.layoutNavigation === 'display' ? showStyle : hideStyle }>

          <Filters
            data={this.props.isolates}
            handleColourDataByDataField={this.props.handleColourDataByDataField}
            handleChangeNodeLabel={this.props.handleChangeNodeLabel}
            colourDataByDataField={this.props.colourDataByDataField}
            setNodeLabelToDataField={this.props.setNodeLabelToDataField} />

        </div>

        <div style={ this.props.layoutNavigation === 'download' ? showStyle : hideStyle }>

          <DownloadProject projectId={this.props.shortId} />

        </div>

        <div style={ this.props.layoutNavigation === 'about' ? showStyle : hideStyle }>

          <AboutProject metadata={this.props.metadata} />

        </div>

      </section>
    );
  }
});

module.exports = Data;
