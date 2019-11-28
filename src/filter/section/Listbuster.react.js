import React from 'react';

export default ({ filterKey, heading, isOpen, onChange, onSubmit, value }) => {
  const input = React.createRef();

  React.useEffect(() => {
    componentHandler.upgradeElement(input.current.parentElement);
  }, []);

  React.useEffect(() => {
    const el = input.current;
    if (isOpen) {
      el.parentElement.MaterialTextfield.checkDirty();
      el.focus();
    } else {
      el.value = null;
      el.parentElement.MaterialTextfield.checkDirty();
    }
  }, [ isOpen ]);

  const id = `${filterKey}-filter`;
  return (
    <form
      action="#"
      onClick={isOpen ? e => e.stopPropagation() : null}
      onSubmit={onSubmit}
      autoComplete="off"
      autoCorrect="off"
    >
      <div className="mdl-textfield mdl-js-textfield">
        <input
          className="mdl-textfield__input"
          readOnly={!isOpen}
          id={id}
          onChange={onChange}
          onFocus={() => {
            if (value && value.length) {
              // to fix cursor position
              input.current.setSelectionRange(value.length, value.length);
            }
          }}
          ref={input}
          tabIndex={isOpen ? undefined : '-1'}
          title={heading}
          type="text"
          value={value}
        />
        <label className="mdl-textfield__label" htmlFor={id}>
          {heading}
        </label>
      </div>
    </form>
  );
};
