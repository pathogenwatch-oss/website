export default [
  {
    section: 0,
    index: 2,
    text: 'Colour labels',
    isActive: (tree) => tree.state.styleLeafLabels,
    handler: (tree) => tree.setState({ styleLeafLabels: !tree.state.styleLeafLabels }),
  },
  {
    section: 0,
    index: 3,
    text: 'Leaf nodes',
    isActive: (tree) => tree.state.styleLeafNodes,
    handler: (tree) => tree.setState({ styleLeafNodes: !tree.state.styleLeafNodes }),
  },
  {
    section: 0,
    index: 4,
    text: 'Internal nodes',
    isActive: (tree) => tree.state.styleInternalNodes,
    handler: (tree) => tree.setState({ styleInternalNodes: !tree.state.styleInternalNodes }),
  },
  {
    section: 0,
    index: 5,
    text: 'Colour edges',
    isActive: (tree) => tree.state.styleNodeLines,
    handler: (tree) => tree.setState({ styleNodeLines: !tree.state.styleNodeLines }),
  },
  {
    section: 0,
    index: 7,
    text: 'Block headers',
    isActive: (tree) => tree.state.metadata.showHeaders,
    handler: (tree) => {
      tree.setState({
        metadata: {
          ...tree.state.metadata,
          showHeaders: !tree.state.metadata.showHeaders,
        },
      });
    },
  },
  {
    section: 0,
    index: 8,
    text: 'Block labels',
    isActive: (tree) => tree.state.metadata.showLabels,
    handler: (tree) => {
      tree.setState({
        metadata: {
          ...tree.state.metadata,
          showLabels: !tree.state.metadata.showLabels,
        },
      });
    },
  },
];
