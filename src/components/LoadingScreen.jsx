import React from 'react';
import { motion } from 'framer-motion';
import { Drumstick } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <Drumstick size={64} color="var(--color-primary)" />
            </motion.div>
            <h2 style={{
                color: 'white',
                fontFamily: 'var(--font-display)',
                letterSpacing: '2px',
                fontSize: '1.5rem',
                margin: 0
            }}>
                LOADING<span style={{ color: 'var(--color-primary)' }}>...</span>
            </h2>
        </div>
    );
};

export default LoadingScreen;
