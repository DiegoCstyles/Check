import React from 'react';
var Modal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, children = _a.children;
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/80 p-2 rounded shadow-md">
        {children}
        <button onClick={onClose} className="mt-2 p-2 text-white border-b-4">
          Fechar
        </button>
      </div>
    </div>);
};
export default Modal;
