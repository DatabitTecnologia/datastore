import React, { forwardRef } from 'react';
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa';

export const CompartilharProduto = forwardRef(({ itemselec }, ref) => {
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <div
        style={{
          right: '110%',
          left: 'auto',
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          zIndex: 999,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '180px',
          alignItems: 'right'
        }}
      >
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Confira este produto: ${itemselec?.nome} ${window.location.href}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          <FaWhatsapp size={18} color="#25D366" style={{ marginRight: '8px' }} />
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            `Confira este produto: ${itemselec?.nome} ${window.location.href}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          <FaTwitter size={18} color="#1DA1F2" style={{ marginRight: '8px' }} />
          Twitter
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          <FaFacebook size={18} color="#3b5998" style={{ marginRight: '8px' }} />
          Facebook
        </a>
      </div>
    </div>
  );
});

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#333',
  backgroundColor: '#f3f3f3',
  padding: '6px 10px',
  borderRadius: '6px',
  fontSize: '14px',
  transition: '0.3s'
};
