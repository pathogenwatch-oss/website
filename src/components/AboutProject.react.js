var React = require('react');

var AboutProject = React.createClass({

  propTypes: {
    metadata: React.PropTypes.object.isRequired
  },

  getMetadataValue: function (metadataField, metadataValue) {
    if (metadataField === 'website') {
      return (
        <a href={metadataValue} target="_blank">{metadataValue}</a>
      );
    } else if (metadataField === 'email') {
      return (
        <a href={'mailto:' +metadataValue} target="_blank">{metadataValue}</a>
      );
    } else {
      return metadataValue;
    }
  },

  getMetadataElements: function () {
    var metadata = this.props.metadata;
    var metadataFields = Object.keys(metadata);
    var metadataValue;

    var h4Style = {
      fontWeight: '600',
      fontSize: '15px',
      color: '#555'
    };

    var pStyle = {
      margin: '0 0 20px 0',
      fontSize: '16px'
    };

    var metadataElements = metadataFields.map(function (metadataField) {
      metadataValue = metadata[metadataField];

      if (metadataValue) {
        return (
          <div key={metadataField}>
            <h4 style={h4Style}>{metadataField.toUpperCase()}</h4>
            <p style={pStyle}>
              {this.getMetadataValue(metadataField, metadataValue)}
            </p>
          </div>
        );
      }

      return;

    }.bind(this));

    return metadataElements;
  },

  render: function () {

    var containerStyle = {
      padding: '10px 20px'
    };

    return (
      <section className="container-fluid" style={containerStyle}>
        {this.getMetadataElements()}
      </section>
    );
  }
});

module.exports = AboutProject;
