import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    sendEmailVerification
} from "firebase/auth";

function LoginPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isPhoneView, setIsPhoneView] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [username, setUsername] = useState('');

    const handleEmailPasswordSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        if (!isLoginView) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;  // --- Validation for Sign Up ---
            if (!passwordRegex.test(password)) {
                setError("Password must be 8+ characters with an uppercase letter, a number, and a special symbol.");
                setIsLoading(false);
                return;
            }
            if (!username) {setError("Please enter a username."); setIsLoading(false); return;}
            const usersRef = collection(db, "users"); //Check for unique username
            const q = query(usersRef, where("username", "==", username));
            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {setError("This username is already taken. Please choose another."); setIsLoading(false); return;}
            } 
            catch (err) {
                console.error("Error checking username:", err);
                setError("An error occurred while checking the username. Please try again.");
                setIsLoading(false);
                return;
            }
        }

        try {
            if (isLoginView) {await signInWithEmailAndPassword(auth, email, password);}
            else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), { // Save username and email to Firestore
                    username: username,
                    email: user.email,
                    avatarId: 0,
                    accent: 'green'
                });
                await sendEmailVerification(user); // Send email verification
            }
        } 
        catch (err) {
            console.error("Authentication failed:", err);
            switch (err.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    setError('Incorrect email or password. Please try again.');
                    break;
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Please sign in.');
                    break;
                default:
                    setError('An error occurred. Please try again.');
                    break;
            }
        }
        finally {setIsLoading(false);}
    };

    const handleGoogleSignIn = async () => {
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {// If the document does not exist, create it
                await setDoc(userDocRef, {
                    username: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    avatarId: 0,
                    accent: 'green' // Default accent color
                });
            }
        } 
        catch (err) {
            console.error("Google Sign-In failed:", err);
            setError("Could not sign in with Google. Please try again.");
        }
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => handleSendOtp()
            });
        }
    };

    const handleSendOtp = async () => {
        if (!phone) {setError("Please enter a phone number."); return;}
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
            window.confirmationResult = confirmationResult;
            setIsOtpSent(true);
            setError('');
        }
        catch (err) {console.error("OTP error:", err); setError("Failed to send OTP. Please try again.");}
    };

    const handleVerifyOtp = async () => {
        try {
            await window.confirmationResult.confirm(otp);
            setError('');
        }
        catch (err) {
            console.error("OTP verification failed:", err);
            setError("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-title">{isLoginView ? 'Welcome Back' : 'Create an Account'}</h1>
            <p className="auth-subtitle">{isLoginView ? 'Sign in to continue your journey' : 'Get started with Rivor Insights'}</p>
            <button onClick={handleGoogleSignIn} className="auth-button" style={{ backgroundColor: '#fff', color: '#333', border: '1px solid var(--border)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" style={{ width: '18px', height: '18px' }} />
                Sign in with Google
            </button>
            <p style={{ fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
                {isPhoneView ? (<>Want to use email instead? <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }} onClick={() => { setIsPhoneView(false); setError(''); }}>Use Email</span></>) : (<>Want to use phone number instead? <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }} onClick={() => { setIsPhoneView(true); setError(''); }}>Use Phone</span></>)}
            </p>
            {isPhoneView && (
                <>
                    <div className="input-group">
                        <label className="input-label" htmlFor="phone">Phone Number</label>
                        <input id="phone" className="input-field" type="tel" placeholder="+91xxxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div id="recaptcha-container"></div>
                    {isOtpSent ? (
                        <>
                            <div className="input-group">
                                <label className="input-label" htmlFor="otp">Enter OTP</label>
                                <input id="otp" className="input-field" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
                            </div>
                            <button onClick={handleVerifyOtp} className="auth-button">Verify OTP</button>
                        </>
                    ) : (<button onClick={handleSendOtp} className="auth-button" style={{ marginBottom: '16px' }}>Sign in with Phone</button>)}
                </>
            )}
            {!isPhoneView && (<div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px 0' }}><hr style={{ flex: '1', borderColor: 'var(--border)' }} /><span style={{ color: 'var(--secondary-text)', fontSize: '12px' }}>OR</span><hr style={{ flex: '1', borderColor: 'var(--border)' }} /></div>)}
            {!isPhoneView && (
                <form onSubmit={handleEmailPasswordSubmit}>
                    {!isLoginView && (
                        <div className="input-group">
                            <label className="input-label" htmlFor="username">Username</label>
                            <input id="username" className="input-field" type="text" placeholder="your_username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                    )}
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input id="email" className="input-field" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input id="password" className="input-field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {isLoginView && (
                        <p style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '20px', fontSize: '14px' }}>
                            <a href="#forgot-password" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>
                                Forgot Password?
                            </a>
                        </p>
                    )}
                    {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
                    <button type="submit" className="auth-button" disabled={isLoading}>{isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}</button>
                </form>
            )}
            <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--secondary-text)' }}>{isLoginView ? "Don't have an account? " : "Already have an account? "}<span onClick={() => { setIsLoginView(!isLoginView); setError(''); }} style={{ color: 'var(--accent)', fontWeight: '600', cursor: 'pointer' }}>{isLoginView ? 'Sign Up' : 'Sign In'}</span></p>
        </div>
    );
}
export default LoginPage;