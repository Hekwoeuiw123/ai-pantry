import React from 'react';
import './Modal.css'
import { FaTimes } from "react-icons/fa";
export function Modal({ children, onClose }) {

  // This stops the modal from closing when you click *inside* the content
  // basically event propogation ko stop kr raha hai ye yeha  iski utni need thi nhi 
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // modal onclose prop leta hai jo close krdega  modal ko 
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}