var React = require('react');
var vis = require('vis');
var moment = require('moment');
var DataUtils = require('../utils/Data');
var TimelineUtils = require('../utils/Timeline');

var Timeline = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    height: React.PropTypes.number.isRequired,
    colourDataByDataField: React.PropTypes.string,
    filterStartDate: React.PropTypes.object.isRequired,
    filterEndDate: React.PropTypes.object.isRequired
  },

  FILTER_START: 'filter_start',
  FILTER_END: 'filter_end',
  FILTER_BACKGROUND: 'filter_background',

  timeline: null,
  items: null,

  getInitialState: function () {
    return {
      startDateDay: null,
      startDateMonth: null,
      startDateYear: null,

      endDateDay: null,
      endDateMonth: null,
      endDateYear: null,

      hasHeightChanged: false,
      hasColourDataByDataFieldChanged: false
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.colourDataByDataField !== this.props.colourDataByDataField) {
      this.setState({
        hasColourDataByDataFieldChanged: true
      });
    } else {
      this.setState({
        hasColourDataByDataFieldChanged: false
      });
    }

    if (nextProps.height !== this.props.height) {
      this.setState({
        hasHeightChanged: true
      });
    } else {
      this.setState({
        hasHeightChanged: false
      });
    }
  },

  componentWillMount: function () {
    var startDate = this.props.filterStartDate;
    var endDate = this.props.filterEndDate;

    this.setState({
      startDateDay: moment(startDate).format('DD'),
      startDateMonth: moment(startDate).format('MM'),
      startDateYear: moment(startDate).format('YYYY'),

      endDateDay: moment(endDate).format('DD'),
      endDateMonth: moment(endDate).format('MM'),
      endDateYear: moment(endDate).format('YYYY')
    });
  },

  createTimelineItemsFromData: function (dataObjects) {
    var items = [];
    var colourDataByDataField = this.props.colourDataByDataField;
    var date;
    var color;

    dataObjects.forEach(function (dataObject) {

      date = TimelineUtils.getDate(dataObject);

      if (! date) {
        return;
      }

      dataObjectId = DataUtils.getDataObjectId(dataObject);
      color = DataUtils.getColor(colourDataByDataField, dataObject);

      items.push({
        id: dataObjectId,
        content: '',
        start: date,
        type: 'point',
        color: color,
        group: 'items'
      });
    });

    return items;
  },

  dangerouslyOverwriteRedraw: function () {
    // https://github.com/almende/vis/issues/886

    var PointItem = vis.timeline.components.items.PointItem;

    // override the redraw method of PointItem
    PointItem.prototype.origRedraw = PointItem.prototype.redraw;
    PointItem.prototype.redraw = function () {
      // first invoke the original redraw
      this.origRedraw();

      // apply our custom color to the dot
      // supposes you've provided a color property for the items
      this.dom.dot.style.borderColor = this.data.color;
    }
  },

  dangerouslyRevertRedraw: function () {
    var PointItem = vis.timeline.components.items.PointItem;
    PointItem.prototype.redraw = PointItem.prototype.origRedraw;
    delete PointItem.prototype.origRedraw;
  },

  getFilterBackground: function () {
    var startDate = this.props.filterStartDate;
    var endDate = this.props.filterEndDate;

    var filterBackground = {
      id: this.FILTER_BACKGROUND,
      content: '',
      start: startDate,
      end: endDate,
      type: 'background'
    };

    return filterBackground;
  },

  getDataSet: function () {
    var data = this.props.data;
    var dataObjects = DataUtils.convertDataObjectToArray(data);
    var dataSet = this.createTimelineItemsFromData(dataObjects);

    dataSet.push(this.getFilterBackground());

    return dataSet;
  },

  createTimeline: function () {
    this.dangerouslyOverwriteRedraw();

    var dataSet = this.getDataSet();

    this.items = new vis.DataSet(dataSet);

    var timelineContainer = React.findDOMNode(this.refs.timeline);
    var timelineOptions = {
        maxHeight: this.props.height,
        selectable: false,
        editable: false,
        showCurrentTime: false,
        showCustomTime: false
    };

    this.timeline = new vis.Timeline(timelineContainer, null, timelineOptions);
    this.timeline.setItems(this.items);

    var filterStartDate = this.props.filterStartDate;
    var filterEndDate = this.props.filterEndDate;

    this.timeline.addCustomTime(filterStartDate, this.FILTER_START);
    this.timeline.addCustomTime(filterEndDate, this.FILTER_END);

    this.timeline.on('timechange', function (event) {

      var item = this.items.get(this.FILTER_BACKGROUND);
      var date;

      if (event.id === this.FILTER_START) {

        date = new Date(event.time);

        item.start = date;

        this.setState({
          startDateDay: moment(date).format('DD'),
          startDateMonth: moment(date).format('MM'),
          startDateYear: moment(date).format('YYYY')
        });

      } else if (event.id === this.FILTER_END) {

        date = new Date(event.time);

        item.end = date;

        this.setState({
          endDateDay: moment(date).format('DD'),
          endDateMonth: moment(date).format('MM'),
          endDateYear: moment(date).format('YYYY')
        });
      }

      this.items.update(item);

    }.bind(this));

    this.timeline.on('timechanged', function (event) {
      var startYear = this.state.startDateYear;
      var startMonth = (this.state.startDateMonth || 1);
      var startDay = (this.state.startDateDay || 1);

      var endYear = this.state.endDateYear;
      var endMonth = (this.state.endDateMonth || 1);
      var endDay = (this.state.endDateDay || 1);

      var startDate = new Date(startYear, startMonth - 1, startDay);
      var endDate = new Date(endYear, endMonth - 1, endDay);

      this.props.onTimelineFilterChange(startDate, endDate);

    }.bind(this));
  },

  destroyTimeline: function () {
    this.dangerouslyRevertRedraw();
    this.timeline.destroy();
    this.timeline = null;
  },

  componentDidMount: function () {
    this.createTimeline();
  },

  componentDidUpdate: function () {
    if (this.state.hasColourDataByDataFieldChanged) {

      this.destroyTimeline();
      this.createTimeline();

    } else {

      if (this.state.hasHeightChanged) {

        this.timeline.setOptions({
          'maxHeight': this.props.height
        });

        this.timeline.redraw();
      }
    }
  },

  handleChange: function (event) {
    var startDateDay = React.findDOMNode(this.refs.startDateDay).value;
    var startDateMonth = React.findDOMNode(this.refs.startDateMonth).value;
    var startDateYear = React.findDOMNode(this.refs.startDateYear).value;

    var endDateDay = React.findDOMNode(this.refs.endDateDay).value;
    var endDateMonth = React.findDOMNode(this.refs.endDateMonth).value;
    var endDateYear = React.findDOMNode(this.refs.endDateYear).value;

    this.setState({
      startDateDay: startDateDay,
      startDateMonth: startDateMonth,
      startDateYear: startDateYear,

      endDateDay: endDateDay,
      endDateMonth: endDateMonth,
      endDateYear: endDateYear
    });
  },

  handleSubmitTimelineChange: function (event) {
    event.preventDefault();

    var startDateDay = React.findDOMNode(this.refs.startDateDay).value;
    var startDateMonth = React.findDOMNode(this.refs.startDateMonth).value;
    var startDateYear = React.findDOMNode(this.refs.startDateYear).value;

    var endDateDay = React.findDOMNode(this.refs.endDateDay).value;
    var endDateMonth = React.findDOMNode(this.refs.endDateMonth).value;
    var endDateYear = React.findDOMNode(this.refs.endDateYear).value;

    var startDate = new Date(startDateYear, startDateMonth - 1, startDateDay);
    var endDate = new Date(endDateYear, endDateMonth - 1, endDateDay);

    this.timeline.setCustomTime(startDate, this.FILTER_START);
    this.timeline.setCustomTime(endDate, this.FILTER_END);

    var filterBackgroundItem = this.items.get(this.FILTER_BACKGROUND);
    filterBackgroundItem.start = startDate;
    filterBackgroundItem.end = endDate;
    this.items.update(filterBackgroundItem);

    this.props.onTimelineFilterChange(startDate, endDate);
  },

  render: function () {

    var containerStyle = {
      width: '100%',
      height: '100%'
    };

    var filterStatusContainerStyle = {
      height: '50px',
      padding: '10px',
      overflow: 'scroll'
    };

    var filterStartDateStyle = {
      display: 'inline-block',
      fontWeight: '600',
      width: '300px',
      padding: '10px',
      textAlign: 'center'
    };

    var filterEndDateStyle = {
      display: 'inline-block',
      fontWeight: '600',
      width: '300px',
      padding: '10px',
      textAlign: 'center'
    };

    var inputStyle = {
      width: '50px',
      margin: '0 1px'
    };

    var textStyle = {
      display: 'inline-block',
      fontWeight: '600',
      margin: '0 10px'
    };

    var filterButtonStyle = {
      marginLeft: '10px'
    };

    return (
      <div style={containerStyle}>

        <div style={filterStatusContainerStyle}>
          <form className="form-inline text-center">

            <div className="form-group">
              <div style={textStyle}>From</div>
            </div>

            <div className="form-group">
              <input type="text" className="form-control input-sm" style={inputStyle} value={this.state.startDateDay} ref="startDateDay" onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <input type="text" className="form-control input-sm" style={inputStyle} value={this.state.startDateMonth} ref="startDateMonth" onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <input type="text" className="form-control input-sm" style={inputStyle} value={this.state.startDateYear} ref="startDateYear" onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <div style={textStyle}>To</div>
            </div>

            <div className="form-group">
              <input type="text" className="form-control input-sm" style={inputStyle} value={this.state.endDateDay} ref="endDateDay" onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <input type="text" className="form-control input-sm" style={inputStyle} value={this.state.endDateMonth} ref="endDateMonth" onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <input type="text" className="form-control input-sm" style={inputStyle} value={this.state.endDateYear} ref="endDateYear" onChange={this.handleChange} />
            </div>

            <button type="submit" className="btn btn-sm btn-default" style={filterButtonStyle} onClick={this.handleSubmitTimelineChange}>Filter</button>

          </form>
        </div>

        <div ref="timeline" data-name="timeline"></div>
      </div>
    );
  }
});

module.exports = Timeline;
