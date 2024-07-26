import React from 'react';

export const Select = ({ dataOptions, ...rest }) => {
  return (
    <div className={rest.containerClass}>
      {rest.label && <label for={rest.id}>{rest.label}</label>}
      <select {...rest}>
        {dataOptions.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
