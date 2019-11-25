import React from 'react';

export default ({ filterKey, heading, isOpen, onChange, onSubmit }) => {
  const itemFilterInput = React.createRef();

  React.useEffect(() => {
    if (isOpen) {
      const el = itemFilterInput.current;
      componentHandler.upgradeElement(el.parentElement);
      el.focus();
    }
  }, [ isOpen ]);

  if (isOpen) {
    return (
      <form action="#" onSubmit={onSubmit} onClick={e => e.stopPropagation()}>
        <div className="mdl-textfield mdl-js-textfield">
          <input className="mdl-textfield__input" type="text" id={`${filterKey}-filter`} ref={itemFilterInput} onChange={onChange} />
          <label className="mdl-textfield__label" htmlFor={`${filterKey}-filter`}>{heading}</label>
        </div>
      </form>
    );
  }

  return <span>{heading}</span>;
};
