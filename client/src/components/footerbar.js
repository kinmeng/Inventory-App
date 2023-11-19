import React from 'react';
import '../styles/footer.css'
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} InnoX - All in one solution for your inventory needs</p>
      </div>
    </footer>
  );
};

export default Footer;