import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmToast = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col items-start gap-2 bg-purple-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-[#a40ff3]">Alert❗</h3>
      <p className="text-sm">{message}</p>
      <div className="flex gap-2 self-end">
        <button
          onClick={() => {
            toast.dismiss();
            onConfirm();
          }}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Yes
        </button>
        <button
          onClick={() => {
            toast.dismiss();
            if (onCancel) onCancel();
          }}
          className="px-3 py-1 bg-gray-300 text-black rounded text-sm"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmToast;
