import React from 'react';
import classnames from 'classnames';

import css from './button.css';

export const Button = ({ children, containerClass, buttonClass, isActive, onClick, disabled }) => {
  return (
    <div className={classnames([
      containerClass,
      css.buttonContainer,
      { [css.active]: isActive }
    ])}>
      <button
        className={classnames([css.button, buttonClass])}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  )
}