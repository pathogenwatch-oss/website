var React = require('react');
var DataUtils = require('../utils/DataUtils');

var Settings = React.createClass({

  handleSubmit: function (e) {
    var shortId;

    e.preventDefault();
    shortId = React.findDOMNode(this.refs.shortId).value.trim();
    this.props.handleUpdateProjectLink(shortId);
  },

  render: function () {
    return (
      <div className="container-fliud">
        <div className="col-sm-12">
          <form className="form-inline" style={{ margin: '20px 0' }} onSubmit={this.handleSubmit}>
            <h4>Update Project Link</h4>
            <p>Personalise the link to this project:</p>
            <div class="form-group">
              <label className="sr-only" for="projectLinkInput">Project Link</label>
              <div className="input-group">
                <span className="input-group-addon">microreact.org/</span>
                <input type="text" id="projectLinkInput" placeholder="Project link" className="form-control" style={{ boxShadow: 'none' }} ref="shortId"/>
                <span className="input-group-btn">
                  <button className="btn btn-primary" type="submit">Update</button>
                </span>
              </div>
              <p className="help-block" ref="form-error-message">{this.renderError()}</p>
            </div>
          </form>
        </div>
      </div>
    );
  },

  renderError: function () {
    var error = this.props.updateLinkError;
    if (!error) {
      return '';
    }
    if (error.message === 'Conflict') {
      return 'Unfortunately this project link is already in use, please try another.';
    }
  }

});

module.exports = Settings;
