import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToProducts, seedProducts } from '../../services/details';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const unsubscribe = subscribeToProducts((data) => {
            setProducts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            {/* Header Animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}
            >
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>OUR SELECTION</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Fresh cuts daily.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {products.length === 0 && !loading && (
                        <button onClick={seedProducts} style={{ background: '#333', color: 'white' }} className="btn">
                            Seed Data
                        </button>
                    )}
                    <Link to="/" className="btn" style={{ border: '1px solid #333', color: 'var(--color-text-muted)' }}>Back Home</Link>
                </div>
            </motion.div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem', fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>STARTING THE GRILL...</div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}
                >
                    {products.map((item) => (
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(217, 4, 41, 0.2)' }}
                            key={item.id}
                            className="product-card"
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid #2a2a2a',
                                borderRadius: '24px', // Standard rounded corners for the card
                                padding: '12px', // Gap between edge and content
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                        >
                            {/* Image with Zoom Effect */}
                            <div style={{
                                height: '240px',
                                borderRadius: '16px', // Rounded corners for image
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url(${item.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        transition: 'transform 0.5s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                {!item.stock && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                        background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '2px', backdropFilter: 'blur(2px)'
                                    }}>
                                        SOLD OUT
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '0 0.5rem 0.5rem 0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.6rem', lineHeight: 1 }}>{item.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>{item.category}</span>
                                </div>

                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                    High quality source, perfectly cut.
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #333', paddingTop: '1rem', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                                        ₹{item.price}
                                    </span>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addToCart(item)}
                                        disabled={!item.stock}
                                        className="btn btn-primary"
                                        style={{
                                            opacity: item.stock ? 1 : 0.5,
                                            padding: '0.6rem 1.2rem',
                                            fontSize: '0.9rem',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        ADD TO CART
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Menu;
