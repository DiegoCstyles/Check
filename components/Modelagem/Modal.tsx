import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/80 p-2 rounded shadow-md">
        {children}
        <button
          onClick={onClose}
          className="mt-2 p-2 text-white border-b-4"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;
