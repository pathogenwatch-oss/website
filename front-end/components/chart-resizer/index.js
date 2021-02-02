import React from 'react';

export default React.createClass({

  componentDidUpdate(previous) {
    const { width, height, chart } = this.props;

    if (!chart) return;

    if (width !== previous.width || height !== previous.height) {
      chart.resize();
    }
  },

  render() {
    const { width, height } = this.props;
    return (
      <div className={this.props.className} style={{ width, height }}>
        {this.props.children}
      </div>
    );
  },

});
