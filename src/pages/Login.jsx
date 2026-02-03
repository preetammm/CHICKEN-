import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Lock, CheckCircle } from 'lucide-react';

const Login = () => {
    const [method, setMethod] = useState('phone'); // 'phone' or 'email'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const { login, loginWithGoogle, loginWithPhone } = useAuth();
    const navigate = useNavigate();

    const setupRecaptcha = () => {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved
                console.log("Recaptcha resolved");
            },
            'expired-callback': () => {
                console.log("Recaptcha expired");
            }
        });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!phoneNumber || phoneNumber.length < 10) {
            setError("Please enter a valid phone number.");
            setLoading(false);
            return;
        }

        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await loginWithPhone(formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setOtpSent(true);
            alert("OTP Sent!");
        } catch (err) {
            console.error("OTP Error:", err);
            // Show the actual error message to help debugging
            setError(`Error: ${err.code || err.message}`);
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await confirmationResult.confirm(otp);
            const user = res.user;

            // Check if user exists in Firestore, if not create/update profile with phone
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    phoneNumber: user.phoneNumber,
                    role: 'client',
                    createdAt: new Date(),
                    displayName: 'Mobile User'
                });
            } else {
                // Ensure phone is updated
                await setDoc(userRef, { phoneNumber: user.phoneNumber }, { merge: true });
            }

            navigate('/');
        } catch (err) {
            console.error(err);
            setError("Invalid OTP. Please check.");
        }
        setLoading(false);
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials.');
        }
        setLoading(false);
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'url("https://images.unsplash.com/photo-1547496502-ffa22d388405?q=80&w=2670&auto=format&fit=crop") center/cover',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)' }}></div>
            <div id="recaptcha-container"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'rgba(20, 20, 20, 0.85)',
                    backdropFilter: 'blur(15px)',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '400px',
                    zIndex: 1,
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>
                        WELCOME <span style={{ color: 'var(--color-primary)' }}>BACK</span>
                    </h2>
                    <p style={{ color: '#888' }}>Sign in to order your cravings</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', marginBottom: '2rem' }}>
                    <button
                        onClick={() => setMethod('phone')}
                        style={{ flex: 1, padding: '0.8rem', border: 'none', background: method === 'phone' ? '#333' : 'transparent', color: method === 'phone' ? 'white' : '#888', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Phone
                    </button>
                    <button
                        onClick={() => setMethod('email')}
                        style={{ flex: 1, padding: '0.8rem', border: 'none', background: method === 'email' ? '#333' : 'transparent', color: method === 'email' ? 'white' : '#888', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Email
                    </button>
                </div>

                {error && <div style={{ background: 'rgba(255,0,0,0.2)', color: '#ff4444', padding: '0.8rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <AnimatePresence mode="wait">
                    {method === 'phone' ? (
                        <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            {!otpSent ? (
                                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#666' }} />
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number (e.g. 9876543210)"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none' }}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                                        {loading ? 'SENDING OTP...' : 'GET OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ textAlign: 'center', color: '#888', marginBottom: '0.5rem' }}>
                                        OTP Sent to {phoneNumber} <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}>(Edit)</button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        style={{ width: '100%', padding: '1rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none', textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
                                    />
                                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                                        {loading ? 'VERIFYING...' : 'VERIFY & LOGIN'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#666' }} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#666' }} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #333', textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await loginWithGoogle();
                                navigate('/');
                            } catch (err) {
                                console.error(err);
                                alert("Google Login Failed");
                            }
                        }}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'white',
                            color: 'black',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            borderRadius: '50px',
                            marginBottom: '1rem'
                        }}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" alt="" />
                        Sign in with Google
                    </button>

                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        New here? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Sign Up</Link>
                    </p>
                    <Link to="/" style={{ display: 'block', marginTop: '1rem', color: '#666', fontSize: '0.8rem' }}>← Continue as Guest</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
