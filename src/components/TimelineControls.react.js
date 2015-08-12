var React = require('react');
var moment = require('moment');
var DataUtils = require('../utils/Data');
var TimelineUtils = require('../utils/Timeline');

var TimelineControls = React.createClass({

  propTypes: {
    filterStartDate: React.PropTypes.object.isRequired,
    filterEndDate: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return this.getState();
  },

  componentWillReceiveProps: function () {
    this.setState(this.getState());
  },

  getState: function () {
    var startDate = this.props.filterStartDate;
    var endDate = this.props.filterEndDate;

    return {
      startDateDay: moment(startDate).format('DD'),
      startDateMonth: moment(startDate).format('MM'),
      startDateYear: moment(startDate).format('YYYY'),

      endDateDay: moment(endDate).format('DD'),
      endDateMonth: moment(endDate).format('MM'),
      endDateYear: moment(endDate).format('YYYY')
    };
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

    this.props.onTimelineFilterChange(startDate, endDate);
  },

  handleSelectAll: function () {

  },

  render: function () {

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
          <button type="submit" className="btn btn-sm btn-default" style={filterButtonStyle} onClick={this.handleSelectAll}>Select all</button>
        </form>
      </div>
    );
  }
});

module.exports = TimelineControls;
