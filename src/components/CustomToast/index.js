import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const icons = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  warning: <FaExclamationTriangle />,
  info: <FaInfoCircle />
};

const backgroundByType = {
  success: sessionStorage.getItem('colorMenu'),
  error: '#dc3545',
  warning: '#ffc107',
  info: '#0d6efd'
};

const CustomToast = ({ appearance, children, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 3000;
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const background = backgroundByType[appearance] || '#333';
  const isLight = appearance === 'warning';

  return (
    <div
      style={{
        backgroundColor: background,
        color: isLight ? '#000' : '#fff',
        padding: '12px 16px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: '380px',
        position: 'relative',
        marginBottom: '5px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>{icons[appearance]}</span>
          <span>{children}</span>
        </div>
        <button
          onClick={onDismiss}
          style={{
            color: isLight ? '#000' : '#fff',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            marginLeft: '10px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      {/* Simulação de progress bar */}
      <div
        style={{
          height: '4px',
          borderRadius: '4px',
          backgroundColor: isLight ? '#333' : '#fff',
          opacity: 0.5,
          width: `${progress}%`,
          transition: 'width 100ms linear'
        }}
      />
    </div>
  );
};

export default CustomToast;
