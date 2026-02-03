import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState(''); // New State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        setError('');
        setLoading(true);

        try {
            await signup(email, password, name, phone); // Pass phone
            navigate('/'); // Redirect to home
        } catch (err) {
            setError('Failed to create account: ' + err.message);
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'url("https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1889&auto=format&fit=crop") center/cover',
            position: 'relative'
        }}>
            {/* Dark Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'rgba(20, 20, 20, 0.9)',
                    backdropFilter: 'blur(15px)',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    textAlign: 'center',
                    width: '400px',
                    zIndex: 1,
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    marginBottom: '0.5rem',
                    color: 'white',
                    letterSpacing: '1px'
                }}>
                    JOIN <span style={{ color: 'var(--color-primary)' }}>PRIME CUTS</span>
                </h2>

                <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    Create an account to start ordering fresh meat.
                </p>

                {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4444', padding: '0.8rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#1a1a1a',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                        <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>OR</span>
                        <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
                    </div>

                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Login</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
