import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import IconButton from '../icon-button';
import Menu from '../menu';
import MenuButton from '../menu-button';
import Search from './Search.react';

class ControlsMenu extends React.Component {
  static propTypes = {
    ...Menu.propTypes,
    clear: PropTypes.func,
    header: PropTypes.bool,
    search: PropTypes.shape({
      value: PropTypes.string,
      onChange: PropTypes.func,
    }),
    size: PropTypes.oneOf([ 'standard', 'narrow' ]),
    summary: PropTypes.node,
    title: PropTypes.string,
  }

  handleClear = e => {
    if (!this.props.open) {
      e.stopPropagation();
    }
    this.props.clear();
  }

  render() {
    const {
      active,
      className,
      header = true,
      open,
      search,
      size = 'standard',
      summary,
      title,
      toggle,
      toggleOnClick = false,
    } = this.props;

    const isActive = 'active' in this.props ? active : !!summary;

    return (
      <Menu
        {...this.props}
        active={isActive}
        className={classnames('libmr-ControlsMenu', className, size, { active: isActive })}
        header={header &&
          <header>
            <h3>{title}</h3>
            { search && <Search {...search} /> }
            <IconButton onClick={toggle}>
              <i className="material-icons">close</i>
            </IconButton>
          </header>
        }
        button={
          <MenuButton
            title={title}
            open={open}
            active={isActive}
            label={summary || title}
            clear={isActive ? e => this.handleClear(e) : null}
          />
        }
        toggleOnClick={toggleOnClick}
      />
    );
  }
}

export default ControlsMenu;
