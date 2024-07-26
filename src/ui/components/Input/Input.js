import React from 'react';

export const Input = (props) => {
  return (
    <div className={props.containerClass}>
      {props.label && <label for={props.id}>{props.label}</label>}
      <input {...props} />
    </div>
  )
}