import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const { currentUser, userRole, logout } = useAuth();

    return (
        <div className="home-page">


            {/* Hero Section with Dark Overlay */}
            <header className="hero-header">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.5rem', marginBottom: '1rem', display: 'block' }}>
                        The Taste of Quality
                    </span>
                    <h1 style={{
                        fontSize: '5rem',
                        lineHeight: 1,
                        marginBottom: '1.5rem',
                        color: 'white',
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}>
                        FRESH MEAT <br />
                        <span style={{ WebkitTextStroke: '2px var(--color-primary)', color: 'transparent' }}>DELIVERED DAILY</span>
                    </h1>

                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '500px', marginBottom: '3rem', fontFamily: 'var(--font-body)' }}>
                        Experience the finest selection of farm-fresh poultry. Sourced ethically, prepared hygienically, and delivered with speed.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/menu" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            View Menu <ArrowRight size={20} />
                        </Link>
                        <Link to="/about" className="btn" style={{ background: 'transparent', border: '1px solid white', color: 'white' }}>
                            Our Story
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '10%',
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Star fill="var(--color-accent)" stroke="none" size={20} />
                        <Star fill="var(--color-accent)" stroke="none" size={20} />
                        <Star fill="var(--color-accent)" stroke="none" size={20} />
                        <Star fill="var(--color-accent)" stroke="none" size={20} />
                        <Star fill="var(--color-accent)" stroke="none" size={20} />
                    </div>
                    <p style={{ color: 'white', fontWeight: 'bold' }}>"Best chicken in town!"</p>
                    <small style={{ color: '#aaa' }}>- Food Critic Weekly</small>
                </motion.div>
            </header>
        </div>
    );
};

export default Home;
