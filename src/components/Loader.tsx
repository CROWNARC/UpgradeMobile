import React from 'react';

const Loader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-50"></div>
  </div>
);

export default Loader; 