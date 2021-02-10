import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import AddToSelection from '../selection/AddToSelection.react';
import OrganismCell from './OrganismCell.react';

import { getLastSelectedIndex } from '../selection/selectors';

import { selectRange, toggleSelection } from '../selection/actions';

import { getFormattedDateString } from '~/utils/Date';
import { getCountryName } from '~/utils/country';

import { showGenomeReport } from '~/genome-report';
import { ST } from '~/mlst';
import { analysisLabels } from '~/app/constants';

const Cell = ({ title, icon, children, onClick }) => (
  <span
    className="wgsa-genome-list-cell wgsa-overflow-fade"
    title={title}
    onClick={onClick}
  >
    {icon && (
      <i title={title} className="material-icons">
        {icon}
      </i>
    )}
    {children}
  </span>
);

const EmptyCell = <span className="wgsa-genome-list-cell wgsa-overflow-fade" />;

const displayAccessLevel = props => {
  if (props.reference) {
    return (
      <Cell title="Access" icon="book">
        Reference
      </Cell>
    );
  }

  if (props.public) {
    return (
      <Cell title="Access" icon="public">
        Public
      </Cell>
    );
  }

  return (
    <Cell title={`Uploaded at ${props.uploadedAt}`} icon="person">
      Private
    </Cell>
  );
};

const ListItem = ({
                    index,
                    genome,
                    onClick,
                    style,
                    onViewGenome,
                    className,
                    onMouseOver,
                  }) => {
  const { name, type, type2, typeSource, country } = genome;
  const countryName = country ? getCountryName(country) : null;
  const date = genome.year ? getFormattedDateString(genome) : null;

  return (
    <div
      className={classnames(
        className,
        'wgsa-genome-list-item wgsa-genome-list-item--selectable'
      )}
      style={style}
      onClick={onClick}
      onMouseOver={onMouseOver}
    >
      <Cell title={name}>
        <AddToSelection genomes={[ genome ]} index={index} onClick={onClick} />
        <button
          title="View report"
          className="wgsa-link-button"
          onClick={onViewGenome}
        >
          {name}
        </button>
      </Cell>
      <Cell>
        <OrganismCell genome={genome} />
      </Cell>
      {type && (
        <React.Fragment>
        <Cell>
          <ST id={type} />
          {!!type2 &&
          <React.Fragment>
              &nbsp;/&nbsp;<ST id={type2} />
            </React.Fragment>}
        </Cell>
        <Cell>
         {analysisLabels[typeSource]}
        </Cell>
        </React.Fragment>
      )}
      {!type && (
          EmptyCell
      )}
      {!typeSource && (
        EmptyCell
      )}
      {country ? (
        <Cell title={countryName}>
          <strong>{country.toUpperCase()}</strong> &ndash; {countryName}
        </Cell>
      ) : (
        EmptyCell
      )}
      {date ? <Cell title={date}>{date}</Cell> : EmptyCell}
      {displayAccessLevel(genome)}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    lastSelectedIndex: getLastSelectedIndex(state),
  };
}

function mergeProps(state, { dispatch }, props) {
  const { lastSelectedIndex } = state;
  const { genome, index } = props;
  return {
    ...props,
    onViewGenome: e =>
      e.stopPropagation() || dispatch(showGenomeReport(genome.id, genome.name)),
    onClick: e => {
      e.stopPropagation();
      if (e.shiftKey && lastSelectedIndex !== null) {
        dispatch(selectRange(lastSelectedIndex, index));
      } else {
        dispatch(toggleSelection([ genome ], index));
      }
    },
  };
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(ListItem);
