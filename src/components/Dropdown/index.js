import React, { useState } from 'react';

const Dropdown = ({ options, label, onChange, style }) => {
  const [selected, setSelected] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    if (onChange) {
      onChange(value); // notifica o pai com o novo valor
    }
  };

  return (
    <div className="dropdown-container" style={style}>
      {label && <label className="dropdown-label">{label}</label>}
      <select className="dropdown-select" value={selected} onChange={handleChange}>
        {options &&
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Dropdown;
