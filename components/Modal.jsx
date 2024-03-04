"use client";

import { useState } from 'react';

const Modal = ({ children, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-6">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        {children}
      </div>
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity ${
          isOpen ? '' : 'hidden'
        }`}
        onClick={closeModal}
      ></div>
    </div>
  );
};

export default Modal;
