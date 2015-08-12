var React = require('react');
var assign = require('object-assign');

var FileUploadingProgress = require('./FileUploadingProgress.react');
var UploadingAssembliesProgress = require('./UploadingAssembliesProgress.react');

var fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%'
};

var dropZoneStyle = assign({}, fullWidthAndHeightStyle, {
  background: '-webkit-gradient(linear,left top,left bottom,color-stop(0,#f7f7f7),color-stop(1,#ebebeb))',
  padding: '30px',
  overflow: 'scroll'
});

var dropTargetContainerStyle = assign({}, fullWidthAndHeightStyle, {
  // display: 'table',
  textAlign: 'center'
});

var dropTargetStyle = {
  // display: 'table-cell',
  // verticalAlign: 'middle'
};

var iconStyle = {
  fontSize: '40px',
  color: '#bbb',
  textShadow: '1px 1px #fff'
};

var headerStyle = {
  fontWeight: '300',
  fontSize: '20px',
  textShadow: '1px 1px #fff'
};

var featureStyle = {
  fontWeight: '500'
};

var FA_SPIN_CLASS = 'fa-spin';
var FA_COG_CLASS = 'fa fa-cog';
var ICON_CLASS = FA_COG_CLASS + ' ' + FA_SPIN_CLASS;

var UploadingFiles = React.createClass({
  render: function () {
    return (
      <div style={dropZoneStyle}>
        <div style={dropTargetContainerStyle}>
          <div style={dropTargetStyle}>
            <i className={ICON_CLASS} style={iconStyle}></i>
            <h2 style={headerStyle}><span style={featureStyle}>Uploading</span> and <span style={featureStyle}>analysing</span> your files.</h2>

            <div className="row">
              <div className="col-sm-8 col-sm-offset-2">
                <FileUploadingProgress />
                <UploadingAssembliesProgress />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = UploadingFiles;
