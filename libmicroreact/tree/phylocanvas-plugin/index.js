import phylocanvas from '@cgps/phylocanvas';
import setRoot from '@cgps/phylocanvas/functions/setRoot';

import createCanvasLasso from '../../canvas-lasso';
import drawShape from '../../shape/draw';
import drawPieChart from '../../pie-chart/draw';
import theme from '../../theme';

export default function (component) {
  return (tree, decorate) => {
    tree.lasso = createCanvasLasso(tree.ctx.canvas, tree.ctx.canvas, {
      isActive: component.props.lasso,
      path: component.props.path,
      onPathChange: path => {
        if (path === null && component.props.highlightedIds.length) {
          return;
        }
        let ids = null;
        if (path) {
          ids = [];
          const layout = tree.layout();
          for (const leaf of layout.leafNodes) {
            if (tree.lasso.isPointInside(leaf, path)) {
              ids.push(leaf.id);
            }
          }
        }
        component.props.onFilterChange(ids, path);
      },
      onRedrawRequested: () => tree.render(),
      translateToCanvas: points =>
        points.map(point =>
          phylocanvas.utils.unmapPoint(tree, point.x, point.y)
        ),
      translateFromCanvas: (x, y) => phylocanvas.utils.mapPoint(tree, x, y),
    });

    const addTreeToHistory = () => {
      setTimeout(
        () => component.props.onAddHistoryEntry(tree.ctx.canvas.toDataURL()),
        0
      );
    };

    tree.drawNodeShape = function ({ state, ctx }, node, shape, size, radius = size / 2) {
      if (node.isLeaf) {
        if (state.styleLeafNodes) {
          drawShape(ctx, 0, 0, radius, shape, ctx.fillStyle, null, state.renderLeafBorders ? ctx.lineWidth : 0);
        }
      } else {
        if (((node.isCollapsed && state.styleLeafNodes) || state.styleInternalNodes) && node.piechartSlices) {
          drawPieChart(ctx, 0, 0, radius, node.piechartSlices, null, state.renderLeafBorders ? ctx.lineWidth : 0);
        }
      }
    }.bind(null, tree);

    decorate('collapseNode', (delegate, args) => {
      delegate(...args);
      addTreeToHistory();
    });

    decorate('layout', (delegate, args) => {
      const layout = delegate(...args);

      tree._.piechart = tree._.piechart || {};

      if (
        tree.state.styleInternalNodes === true ||
        tree.state.collapsedIds.length
      ) {
        if (tree._.piechart.styles !== tree.state.styles) {
          const leafNodeStyle = {
            fillStyle: tree.state.fillStyle,
            ...tree.state.leafNodeStyle,
          };
          for (const node of layout.postorderTraversal) {
            if (node.isLeaf) {
              const nodeStyle = tree.state.styles
                ? tree.state.styles[node.id]
                : undefined;
              node.strokeStyle =
                (nodeStyle ? nodeStyle.strokeStyle : undefined) ||
                tree.state.strokeStyle;
            } else {
              const slices = {};
              for (const child of node.children) {
                if (child.isLeaf) {
                  const style = tree.state.styles[child.id] || leafNodeStyle;
                  slices[style.fillStyle] = (slices[style.fillStyle] || 0) + 1;
                } else {
                  for (const colour of Object.keys(child.piechartSlices)) {
                    slices[colour] =
                      (slices[colour] || 0) + child.piechartSlices[colour];
                  }
                }
              }
              node.piechartSlices = slices;
            }
          }
          for (const node of layout.postorderTraversal) {
            if (!node.isLeaf) {
              for (const colour of Object.keys(node.piechartSlices)) {
                node.piechartSlices[colour] =
                  node.piechartSlices[colour] / node.totalLeaves;
              }
            }
          }

          tree._.piechart.styles = tree.state.styles;
        }
      }

      return layout;
    });

    decorate('mergeState', (delegate, [ state ]) => {
      delegate(); // notify plugins without rendering
      tree.state = {
        ...tree.state,
        ...state,
        size: {
          width: component.props.width,
          height: component.props.height,
        },
        highlightedStyle: theme.primaryColour,
        haloStyle: theme.primaryColour,
        metadata: {
          ...tree.state.metadata,
          ...state.metadata,
        },
        scalebar: {
          ...tree.state.scalebar,
          ...state.metadata,
        },
      };
    });

    decorate('postRender', (delegate, args) => {
      delegate(...args);
      if (tree.lasso.isActive) {
        tree.ctx.save();
        tree.ctx.scale(tree.pixelRatio, tree.pixelRatio);
        tree.lasso.draw();
        tree.ctx.restore();
        tree.lasso.updateCanvas();
      }
    });

    decorate('rerootNode', (delegate, args) => {
      delegate(...args);
      addTreeToHistory();
    });

    tree.selectNode = (node, isAppend) => {
      // prevent node selection when a lasso path is being drawn
      tree._.selectedNodeId = null;
      if (node && node.isLeaf) {
        component.props.setHighlightedIds([ node.id ], isAppend);
      } else {
        if (component.props.path) {
          if (component.props.highlightedIds.length) {
            component.props.setHighlightedIds();
          }
          return;
        }
        if (node && !node.isHidden) {
          tree._.selectedNodeId = node.id;
          component.props.onFilterChange(tree.getLeafIds(node));
        } else if (!isAppend) {
          if (component.props.highlightedIds.length) {
            component.props.setHighlightedIds();
          } else {
            component.props.onFilterChange(null);
          }
        }
      }
    };

    tree.setRoot = nodeOrId => {
      tree._.selectedNodeId = null;

      let node = null;
      if (nodeOrId !== null) {
        node = tree.getNodeById(nodeOrId);
      }
      tree.setState({
        ...setRoot(tree, node ? node.id : null),
        ids: tree.getLeafIds(nodeOrId),
      });
      addTreeToHistory();
    };

    if (component.props.onPhylocanvasStateChange) {
      decorate('setState', (delegate, [ state ]) => {
        delegate(); // notify plugins without rendering
        component.props.onPhylocanvasStateChange(state);
      });
    }

    decorate('setTreeType', (delegate, args) => {
      delegate(...args);
      addTreeToHistory();
    });

    tree.isUninitialised = () => tree.state.branchScale === null;

    if (component.props.onRedrawOriginalTree) {
      decorate('setSource', (delegate, args) => {
        if (args[0] === tree.nodes.originalSource) {
          component.props.onRedrawOriginalTree();
        } else {
          delegate(...args);
        }
      });
    }
  };
}
