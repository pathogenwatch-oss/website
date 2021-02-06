import React from 'react';
import PropTypes from 'prop-types';

import TreeTypeButton from './TreeTypeButton.react';
import LassoButton from '../../lasso-button';

import defaults from '@cgps/phylocanvas/defaults';

const TreeControls = (props) => (
  <>
    <LassoButton
      active={props.lasso}
      onClick={() => props.onLassoChange(!props.lasso)}
    />
    <div className="libmr-Panel-control-group">
      <TreeTypeButton
        treeType="hr"
        selectedTreeType={props.type}
        handleClick={props.onTypeChange}
      />
      <TreeTypeButton
        treeType="dg"
        selectedTreeType={props.type}
        handleClick={props.onTypeChange}
      />
      <TreeTypeButton
        treeType="rd"
        selectedTreeType={props.type}
        handleClick={props.onTypeChange}
      />
      <TreeTypeButton
        treeType="cr"
        selectedTreeType={props.type}
        handleClick={props.onTypeChange}
      />
      <TreeTypeButton
        treeType="rc"
        selectedTreeType={props.type}
        handleClick={props.onTypeChange}
      />
    </div>
  </>
);

TreeControls.displayName = 'TreeControls';

TreeControls.propTypes = {
  lasso: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  onLassoChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

TreeControls.defaultProps = {
  type: defaults.type,
};

export default TreeControls;
