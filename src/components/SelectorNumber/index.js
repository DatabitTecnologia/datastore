import { useState } from 'react';
import { Minus, Plus } from 'lucide-react'; // ou use outros ícones se quiser

export const SelectorNumber = ({ value, setValue, min = 1, max = 999 }) => {
  const handleDecrease = () => {
    if (value > min) setValue(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) setValue(value + 1);
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val >= min && val <= max) {
        setValue(val);
      } else if (val < min) {
        setValue(min);
      } else if (val > max) {
        setValue(max);
      }
    } else {
      setValue(min); // valor inválido ou apagado → volta pro mínimo
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '4px 10px',
        width: 'fit-content',
        background: '#fff',
        textAlign: 'center'
      }}
    >
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        style={{
          background: 'none',
          border: 'none',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          padding: '4px',
          color: '#333'
        }}
      >
        <Minus size={18} />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        style={{
          width: '50px',
          textAlign: 'center',
          fontSize: '1.2rem',
          border: 'none',
          outline: 'none'
        }}
      />

      <button
        onClick={handleIncrease}
        disabled={value >= max}
        style={{
          background: 'none',
          border: 'none',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          padding: '4px',
          color: '#333'
        }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
};
