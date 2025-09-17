import React, { useEffect } from 'react';
import './Toast.css';

export const Toast = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {onClose();}, 3000); // Auto disappear after 3 seconds
        return () => {clearTimeout(timer);};
    }, [onClose]);
    return (
        <div className={`toast-container ${type}`}>
            <div className="toast-message">{message}</div>
            <button className="toast-close-btn" onClick={onClose}>&times;</button>
        </div>
    );
};