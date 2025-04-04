// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 bg-gray-700   w-full">
      <p className="m-0 text-gray-100">&copy; {new Date().getFullYear()} AI Image Detection</p>
    </footer>
  );
};

export default Footer;