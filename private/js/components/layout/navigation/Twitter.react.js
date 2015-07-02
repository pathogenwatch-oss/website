var React = require('react');

var LayoutNavigationTwitter = React.createClass({

  propTypes: {
    shortProjectId: React.PropTypes.string.isRequired
  },

  render: function () {

    var linkStyle = {
      color: 'inherit'
    };

    var tweetMessage = encodeURIComponent('Take a look at this @MyMicroreact at http://microreact.org/project/' + this.props.shortProjectId);

    return (
      <a href={"http://twitter.com/home?status=" + tweetMessage} target="_blank" style={linkStyle}>
        <i className="fa fa-twitter"></i>
      </a>
    );
  }
});

module.exports = LayoutNavigationTwitter;
