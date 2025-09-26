import { auth } from '../../firebase';
import { sendEmailVerification } from 'firebase/auth';

function VerifyEmailPage({ onLogout }) {
    const handleResendEmail = async () => {
        if (auth.currentUser) {
            try {
                await sendEmailVerification(auth.currentUser);
                alert("A new verification email has been sent to your inbox.");
            }
            catch (error) {
                console.error("Error resending verification email:", error);
                alert("Failed to resend email. Please try again shortly.");
            }
        }
    };
    return (
        <div className="auth-container" style={{ textAlign: 'center' }}>
            <h1 className="auth-title">Verify Your Email</h1>
            <p className="auth-subtitle"> A verification link has been sent to your email address. Please click the link to continue.</p>
            <button onClick={() => window.location.reload()} className="auth-button" style={{ marginBottom: '16px' }}> I have verified my email </button>
            <p style={{ fontSize: '14px' }}>
                Didn't receive an email?{' '}
                <span onClick={handleResendEmail} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}> Resend </span>
            </p>
             <button onClick={onLogout} className="auth-button" style={{ marginTop: '24px', backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--secondary-text)' }}>
                Back to Login
            </button>
        </div>
    );
}
export default VerifyEmailPage;