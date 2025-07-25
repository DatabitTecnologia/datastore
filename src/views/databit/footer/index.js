import React from 'react';
import { FaEnvelope, FaWhatsapp, FaGlobe, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Decode64 } from 'datareact/src/utils/crypto';

const Footer = () => {
  return (
    <footer style={{ background: sessionStorage.getItem('colorMenu'), color: '#fff', padding: '30px 20px', fontFamily: 'sans-serif' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo + Endereço */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '30px' }}>
            <img className="b-logo-login" src={`data:image/jpeg;base64,${sessionStorage.getItem('logofooter')}`} alt="Logo" />
          </div>
          <div style={{ fontSize: '16px', maxWidth: '500px' }}>{Decode64(sessionStorage.getItem('address'))}</div>
        </div>

        {/* Ícones de contato */}
        <div style={{ background: sessionStorage.getItem('colorMenu'), display: 'flex', gap: '10px', marginTop: '10px' }}>
          <a href={'mailto:' + Decode64(sessionStorage.getItem('emailemp'))} target="_blank" rel="noreferrer">
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
          </a>

          <a href={'https://wa.me/' + Decode64(sessionStorage.getItem('whatsapp'))} target="_blank" rel="noreferrer">
            <IconWrapper>
              <FaWhatsapp />
            </IconWrapper>
          </a>

          <a href={Decode64(sessionStorage.getItem('home'))} target="_blank" rel="noreferrer">
            <IconWrapper>
              <FaGlobe />
            </IconWrapper>
          </a>

          <a href={'https://www.instagram.com/' + Decode64(sessionStorage.getItem('instagram'))} target="_blank" rel="noreferrer">
            <IconWrapper>
              <FaInstagram />
            </IconWrapper>
          </a>

          <a href={'https://www.linkedin.com/company/' + Decode64(sessionStorage.getItem('linkedin'))} target="_blank" rel="noreferrer">
            <IconWrapper>
              <FaLinkedin />
            </IconWrapper>
          </a>
        </div>
      </div>

      <hr style={{ margin: '20px 0', borderColor: '#fff' }} />

      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <div className="site-databit">
          <a className="fa-xs" style={{ color: '#fff', fontSize: '14px' }} href="https://www.databit.com.br/" target="blank">
            Copyright © 2025 by DataBit Tecnologia e Sistemas LTDA. All rights reserved
          </a>
        </div>
      </div>
    </footer>
  );
};

const IconWrapper = ({ children }) => (
  <div
    style={{
      background: sessionStorage.getItem('colorMenuselec'),
      padding: '10px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </div>
);

export default Footer;
