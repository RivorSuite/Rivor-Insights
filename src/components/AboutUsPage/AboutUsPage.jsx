import React, { useState } from 'react';
import './AboutUsPage.css';
import qrCodeImage from './RQR.jpg';

function AboutUsPage({ onBack }) {
    const [isQrRevealed, setIsQrRevealed] = useState(false);
    return (
        <div className="about-us-container">
            <div className="about-us-header">
                <h1 className="auth-title">About Rivor Insights</h1>
                <button onClick={onBack} className="auth-button" style={{maxWidth: '150px'}}>Back</button>
            </div>
            <div className="about-us-content">
                <div className="about-us-section">
                    <h2>Our Mission</h2>
                    <p> Rivor Insights is dedicated to making the complex world of data structures and algorithms accessible and engaging for everyone. We believe that with the right tools, anyone can master these fundamental computer science concepts. Our interactive visualizers, code playground, and AI-powered assistant are designed to provide a hands-on learning experience that goes beyond traditional textbooks and lectures.</p>
                    <p> Our goal is to empower the next generation of software engineers, developers, and tech enthusiasts with the confidence and skills they need to excel in their careers.</p>
                </div>
                <div className="about-us-section donate-section">
                    <h2> Support Our Work </h2>
                    <p> If you find our platform helpful, please consider supporting its development. Your contributions help us maintain the servers, develop new features, and keep this resource free and accessible to all.</p>
                    <div className="qr-code-container">
                        <div className="qr-image-wrapper" onClick={() => setIsQrRevealed(true)}>
                            <img 
                                src={qrCodeImage} 
                                alt="UPI QR Code for Donation" 
                                className={`qr-code-image ${!isQrRevealed ? 'blurred' : ''}`}
                            />
                            {!isQrRevealed && (<div className="qr-reveal-overlay"><span> Click to Reveal </span></div>)}
                        </div>
                        <p className="upi-id-text">Scan the QR code with any UPI app to donate.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AboutUsPage;