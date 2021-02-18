import React from 'react';
import PropTypes from 'prop-types';

import ControlsButton from '../../controls-button';
import { RcTreeIcon, CrTreeIcon, RdTreeIcon, DgTreeIcon, HrTreeIcon } from './icons';

const treeTypeIcons = {
  rc: RcTreeIcon,
  cr: CrTreeIcon,
  rd: RdTreeIcon,
  dg: DgTreeIcon,
  hr: HrTreeIcon,
};

const labels = {
  rc: 'Rectangular',
  cr: 'Circular',
  rd: 'Radial',
  dg: 'Diagonal',
  hr: 'Hierarchical',
};

const TreeTypeButton = (props) => {
  const treeType = props.treeType.toLowerCase();
  const isSelected = treeType === props.selectedTreeType;
  const Icon = treeTypeIcons[treeType];
  return (
    <ControlsButton
      active={isSelected}
      title={labels[props.treeType]}
      onClick={() => props.handleClick(props.treeType.toLowerCase())}
    >
      <Icon />
    </ControlsButton>
  );
};

TreeTypeButton.displayName = 'TreeTypeButton';

TreeTypeButton.propTypes = {
  treeType: PropTypes.string.isRequired,
  selectedTreeType: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default TreeTypeButton;
