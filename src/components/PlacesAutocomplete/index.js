import React from 'react';
import { Form } from 'react-bootstrap';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Decode64 } from 'datareact/src/utils/crypto';

const PlacesAutocomplete = ({ value, onChange, onSelect }) => {
  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({ debounce: 300 });

  const handleInput = (e) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({ lat, lng, address });
    } catch (error) {
      console.error('Erro ao obter geocode:', error);
      alert('Não foi possível obter a localização do endereço.');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Form.Control type="text" placeholder="Ex: São Paulo, SP" value={value} onChange={handleInput} />
      <ul>
        {data.map(({ place_id, description }) => (
          <li key={place_id} style={{ padding: 0 }}>
            <button
              type="button"
              onClick={() => handleSelect(description)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(description);
                }
              }}
              style={{
                cursor: 'pointer',
                padding: '6px 8px',
                width: '100%',
                textAlign: 'left',
                border: 'none',
                background: 'none'
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {description}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlacesAutocomplete;
