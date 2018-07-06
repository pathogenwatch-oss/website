/* global sigma */

import React, { Component } from 'react';

class SimpleNetwork extends Component {
  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.network) this.network.kill();
  }

  update() {
    const { nodes = [], edges } = this.props;
    if (!nodes) return;

    const graph = {
      nodes: [ ...nodes ],
      edges: [ ...edges ],
    };

    const nNodes = graph.nodes.length;
    for (let i = 0; i < nNodes; i++) {
      const node = graph.nodes[i];
      node.x = node.x || 100 * Math.cos(2 * i * Math.PI / nNodes);
      node.y = node.y || 100 * Math.sin(2 * i * Math.PI / nNodes);
    }

    // Hack to implement something a bit like a zIndex.
    graph.nodes.sort((a, b) => a.zIndex < b.zIndex);
    graph.edges.sort((a, b) => a.zIndex < b.zIndex);

    // Clean up old plots, if they exist
    if (this.network) {
      this.network.graph.clear();
      this.network.graph.read(graph);
      this.network.refresh();
      return;
    }

    this.network = new sigma({
      graph,
      container: this.root,
      settings: {
        edgeColor: 'default',
        labelColor: 'node',
        labelThreshold: 0, // hack so that nodes with labels are always shown
      },
    });

    const eventNames = Object.keys(this.props.events || {});
    for (const eventName of eventNames) {
      const eventHandler = this.props.events[eventName];
      this.network.bind(eventName, event => eventHandler(event));
    }
  }

  render() {
    const { height, width, style } = this.props;
    return <div style={{ height, width, ...style }} ref={ el => { this.root = el; } } />;
  }
}

export default SimpleNetwork;
