import React from 'react';

const Footer = () => {
  return (
    <footer
      className="bg-gradient-to-r from-blue-700
      to-indigo-700 text-center py-4 text-sm text-white animate-fade-in"
    >
      <div className="text-white flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>© {new Date().getFullYear()} Excel Analytics</span>
        <span className="text-xs text-white">All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;