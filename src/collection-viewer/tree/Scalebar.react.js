import React from 'react';

const style = { width: 80 };

const LOG10 = Math.log(10);
const extraDigits = 0;

export default React.createClass({

  getInitialState() {
    return {
      listening: false,
      zoom: 0,
    };
  },

  componentWillReceiveProps({ phylocanvas }) {
    if (!phylocanvas || this.state.listening) return;

    const delegate = phylocanvas.draw;
    phylocanvas.draw = (...args) => {
      delegate.apply(phylocanvas, args);
      this.setState({ zoom: phylocanvas.zoom });
    };

    this.setState({ listening: true });
  },

  render() {
    if (!this.props.phylocanvas) return null;

    const { branchScalar, zoom } = this.props.phylocanvas;
    if (!(branchScalar && zoom)) return null;

    const scale = style.width / branchScalar / zoom;
    const minDigits = parseInt(Math.abs(Math.log(scale) / LOG10), 10);
    return (
      <div style={style} className="wgsa-tree-scalebar wgsa-tree-overlay">
        {scale.toFixed(minDigits + extraDigits)}
        <hr className="wgsa-tree-scalebar__bar" />
      </div>
    );
  },

});
