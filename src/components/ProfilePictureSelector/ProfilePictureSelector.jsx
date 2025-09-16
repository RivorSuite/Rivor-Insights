import React from 'react';
import { avatarPaths } from '../ProfilePictureSelector/AvatarIcons';
import './ProfilePictureSelector.css';

function ProfilePictureSelector({ onSelect, onClose, currentAvatarId }) {
    return (
        <div className="pfp-selector-overlay" onClick={onClose}>
            <div className="pfp-selector-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Choose Your Avatar</h2>
                <div className="pfp-grid">
                    {avatarPaths.map((path, index) => (
                        <div
                            key={index}
                            className={`pfp-option ${currentAvatarId === index ? 'selected' : ''}`}
                            onClick={() => onSelect(index)}
                        >
                            <img src={path} alt={`Avatar ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <button className="auth-button" onClick={onClose} style={{ marginTop: '20px' }}> Done </button>
            </div>
        </div>
    );
}
export default ProfilePictureSelector;