import '../../css/upload-review.css';

import React from 'react';

import InputField from './InputField.react';

const OverviewStatisticsItem = React.createClass({

  displayName: 'OverviewStatisticsItem',

  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
  },

  componentDidMount() {
    var inputDomElement = this.getDOMNode();
    componentHandler.upgradeElement(inputDomElement);
  },

  render: function () {
    return (
      <div className="wgsa-overview-upload-ready-card mdl-card">
        <div className="mdl-card__title mdl-card--expand">
            {this.props.value}
        </div>
        <span className="mdl-card__actions mdl-card--border">
          {this.props.label}
        </span>
      </div>
    );
  },
});

module.exports = OverviewStatisticsItem;
