import React, { useState } from 'react';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

function ForgotPasswordPage({ onNavigateBack }) {
    const [view, setView] = useState('form'); // 'form' or 'success'
    const [resetEmail, setResetEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        if (!resetEmail) {
            setError("Please enter your email address.");
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setView('success');
        }
        catch (err) {
            console.error("Password reset error:", err);       
            setView('success'); // For security, we show success even if the email doesn't exist.
        } 
        finally {setIsLoading(false);}
    };

    return (
        <div className="auth-container">
            {view === 'form' && (
                <>
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">Enter your email to receive a reset link.</p>
                    <form onSubmit={handlePasswordReset}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="reset-email">Email</label>
                            <input
                                id="reset-email"
                                className="input-field"
                                type="email"
                                placeholder="you@example.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
                        <button type="submit" className="auth-button" disabled={isLoading}> {isLoading ? 'Sending...' : 'Send Reset Link'} </button>
                    </form>
                    <p style={{ marginTop: '24px', fontSize: '14px' }}> <span onClick={onNavigateBack} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}> ← Back to Login </span> </p>
                </>
            )}

            {view === 'success' && (
                 <>
                    <h1 className="auth-title">Check Your Inbox</h1>
                    <p className="auth-subtitle" style={{ lineHeight: 1.6 }}> If an account exists for <strong>{resetEmail}</strong>, you will receive an email with instructions on how to reset your password. </p>
                    <p style={{ marginTop: '24px', fontSize: '14px' }}> <span onClick={onNavigateBack} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}> ← Back to Login </span> </p>
                </>
            )}
        </div>
    );
}
export default ForgotPasswordPage;