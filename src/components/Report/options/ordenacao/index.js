import React, { useState } from 'react';

const SelectOrdenacao = ({ options }) => {
  const [orderValue, setOrderValue] = useState('0');
  const [fieldValue, setFieldValue] = useState('');

  const orderOptions = [
    { value: '0', label: 'Nenhum' },
    { value: '1', label: 'Ordenar' },
    { value: '2', label: 'Agrupar' }
  ];

  const handleOrderChange = (e) => {
    setOrderValue(e.target.value);
    if (e.target.value === '0') {
      setFieldValue('');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div>
        <label className="block mb-1 font-semibold text-gray-700">Ordenação / Agrupamento</label>
        <select
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={orderValue}
          onChange={handleOrderChange}
        >
          {orderOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Deseja ordenar / agrupar por</label>
        <select
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          disabled={orderValue === '0'}
        >
          <option value="">Selecione</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectOrdenacao;
