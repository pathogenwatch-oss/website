import React from 'react';

const CreateCollectionButton = React.createClass({
  render: function () {
    return (
      <button className="btn btn-success" onClick={this.props.handleCreateCollection}>Create Collection</button>
    );
  },
});

module.exports = CreateCollectionButton;
