import React from 'react';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Marca */}
        <div className="footer-section">
          <h2 className="footer-logo">Minha Loja</h2>
          <p>Sua loja de confiança para eletrônicos, moda e muito mais.</p>
        </div>

        {/* Links úteis */}
        <div className="footer-section">
          <h4>Links úteis</h4>
          <ul>
            <li>
              <a href="/sobre">Sobre nós</a>
            </li>
            <li>
              <a href="/politica">Política de Privacidade</a>
            </li>
            <li>
              <a href="/trocas">Trocas e Devoluções</a>
            </li>
            <li>
              <a href="/contato">Fale conosco</a>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div className="footer-section">
          <h4>Atendimento</h4>
          <p>WhatsApp: (11) 99999-9999</p>
          <p>Email: contato@minhaloja.com</p>
          <p>Seg a Sex: 9h às 18h</p>
        </div>

        {/* Redes sociais */}
        <div className="footer-section">
          <h4>Redes sociais</h4>
          <div className="footer-socials">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">© {new Date().getFullYear()} Minha Loja. Todos os direitos reservados.</div>
    </footer>
  );
};

export default Footer;
