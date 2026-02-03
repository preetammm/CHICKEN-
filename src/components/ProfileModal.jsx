import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Import needed Firestore functions
import { db } from '../firebase'; // Import your db instance

const ProfileModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen && currentUser) {
            // Load current phone from Firestore (better than Auth profile usually)
            const loadProfile = async () => {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().phoneNumber) {
                    setPhone(docSnap.data().phoneNumber);
                }
            };
            loadProfile();
        }
    }, [isOpen, currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                phoneNumber: phone
            });
            setMessage("Profile updated successfully!");
            setTimeout(() => {
                setMessage('');
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update.");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(5px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 1000
            }} onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                        background: '#1a1a1a',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid #333',
                        width: '90%',
                        maxWidth: '400px',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>

                    <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={24} color="var(--color-primary)" />
                        Profile Settings
                    </h2>

                    <form onSubmit={handleSave}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                            <input
                                type="text"
                                value={currentUser?.displayName || ''}
                                disabled
                                style={{
                                    width: '100%', padding: '0.8rem', borderRadius: '8px',
                                    border: '1px solid #333', background: '#111', color: '#555',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your mobile number"
                                    required
                                    style={{
                                        width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.8rem',
                                        borderRadius: '8px', border: '1px solid #444',
                                        background: '#222', color: 'white', fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                                This number will be used for order updates and delivery coordination.
                            </p>
                        </div>

                        {message && <p style={{ color: message.includes('Failed') ? '#ff4444' : '#00cc88', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProfileModal;
