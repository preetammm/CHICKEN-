import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, orderTime } = location.state || {}; // Expecting state passed from navigation

    // Fallback if accessed directly without state
    if (!orderId) {
        return (
            <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h1 style={{ color: 'white' }}>No Active Order</h1>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</button>
            </div>
        );
    }

    return (
        <div className="container" style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            paddingTop: '4rem'
        }}>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <CheckCircle size={100} color="var(--color-accent)" style={{ marginBottom: '2rem' }} />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}
            >
                ORDER CONFIRMED!
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ color: '#ccc', fontSize: '1.2rem', maxWidth: '600px', marginBottom: '3rem' }}
            >
                Thank you for choosing PrimeCuts. The shopkeeper has received your order and is firing up the grill!
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                    background: '#1e1e1e',
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid #333',
                    width: '100%',
                    maxWidth: '400px',
                    marginBottom: '3rem'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                    <span style={{ color: '#888' }}>Order ID</span>
                    <span style={{ color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold' }}>#{orderId.slice(-4).toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Time Placed</span>
                    <span style={{ color: 'white' }}>{orderTime}</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
            >
                <button onClick={() => navigate('/orders')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Track Order <ArrowRight size={20} />
                </button>

                <button onClick={() => navigate('/')} className="btn" style={{ background: 'transparent', border: '1px solid #666', color: '#ccc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={20} /> Back to Home
                </button>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
