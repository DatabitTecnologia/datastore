import { Minus, Plus } from 'lucide-react';

export const SelectorNumber = ({
  value,
  setValue,
  min = 1,
  max = 999,
  fontSize = '1.2rem',
  color = '#333',
  borderColor = '#ccc',
  bgColor = '#fff',
  height = '40px'
}) => {
  const handleDecrease = () => {
    if (value > min) setValue(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) setValue(value + 1);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setValue(''); // permite digitar temporariamente
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) setValue(num);
  };

  const handleBlur = () => {
    if (value === '' || value < min) setValue(min);
    if (value > max) setValue(max);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '4px 10px',
        width: 'fit-content',
        background: bgColor,
        textAlign: 'center',
        height: height
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
          color,
          transition: '0.2s'
        }}
      >
        <Minus size={18} />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        style={{
          width: '50px',
          textAlign: 'center',
          fontSize: fontSize,
          border: 'none',
          outline: 'none',
          background: 'transparent'
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
          color,
          transition: '0.2s'
        }}
      >
        <Plus size={18} />
      </button>
    </div>
  );
};
