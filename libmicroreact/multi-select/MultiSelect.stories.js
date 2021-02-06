import React from 'react';

import MultiSelectComponent from './index';

class MultiSelect extends React.Component {
  constructor() {
    super();
    this.state = { selection: [] };
  }

  getItems() {
    return this.props.items.map(item => ({
      ...item,
      selected: this.state.selection.includes(item.value),
    }));
  }

  render() {
    return (
      <div style={{ width: 300 }}>
        <MultiSelectComponent
          items={this.getItems()}
          onSelectionChange={selection => this.setState({ selection })}
          selectionOrder={this.props.ordered ? this.state.selection : null}
        />
        <p>Selection order: {this.state.selection.join(', ')}</p>
      </div>
    );
  }
}

const items = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
];

export default {
  title: 'Forms/Multi-Select',
};

export const Default = () => <MultiSelect items={items} />;

Default.story = {
  name: 'default',
};

export const WithOrderedSelection = () => <MultiSelect items={items} ordered />;

WithOrderedSelection.story = {
  name: 'with ordered selection',
};
