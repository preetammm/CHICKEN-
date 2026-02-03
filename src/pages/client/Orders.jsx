import React, { useEffect, useState } from 'react';
import { subscribeToClientOrders } from '../../services/details';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
// Navbar removed (Global)

const ClientOrders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const unsubscribe = subscribeToClientOrders(currentUser.uid, (data) => {
                setOrders(data);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (!currentUser) return (
        <>
            <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '1rem', paddingTop: '80px' }}>
                <h2 style={{ color: 'white' }}>Please Login to view orders</h2>
                <Link to="/login" className="btn btn-primary">Login Now</Link>
            </div>
        </>
    );

    return (
        <>
            {/* Global Navbar handles navigation */}
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: '100vh' }}>
                <h1 style={{
                    color: 'white',
                    fontSize: '3rem',
                    borderBottom: '1px solid #333',
                    paddingBottom: '1rem',
                    marginBottom: '2rem'
                }}>
                    MY <span style={{ color: 'var(--color-primary)' }}>ORDERS</span>
                </h1>

                {loading ? (
                    <div style={{ color: '#888' }}>Loading history...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                        {/* ACTIVE ORDERS */}
                        <div>
                            <h2 style={{ color: '#ccc', fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary)', paddingLeft: '1rem' }}>Active Orders</h2>
                            {orders.filter(o => o.status !== 'completed').length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic' }}>No active orders right now.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {orders.filter(o => o.status !== 'completed').map((order, index) => (
                                        <OrderCard key={order.id} order={order} index={index} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PAST ORDERS */}
                        <div>
                            <h2 style={{ color: '#ccc', fontSize: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #666', paddingLeft: '1rem' }}>Past Orders</h2>
                            {orders.filter(o => o.status === 'completed').length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic' }}>No past orders found.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {orders.filter(o => o.status === 'completed').map((order, index) => (
                                        <OrderCard key={order.id} order={order} index={index} isHistory={true} />
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </>
    );
};

const OrderCard = ({ order, index, isHistory }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        style={{
            background: isHistory ? 'rgba(30, 30, 30, 0.4)' : 'rgba(30, 30, 30, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: isHistory ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(217, 4, 41, 0.2)',
            padding: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        }}
    >
        <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.4rem', fontFamily: 'monospace' }}>#{order.id.slice(-4).toUpperCase()}</h3>
                <OrderStatusBadge status={order.status} estimatedTime={order.estimatedTime} />
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={14} />
                {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
            </p>

            {/* Address & Instructions Display */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                {order.address && (
                    <div style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Delivery To:</strong>
                        <span style={{ color: '#ddd' }}>{order.address}</span>
                    </div>
                )}
                {order.instructions && (
                    <div>
                        <strong style={{ color: '#aaa', display: 'block', marginBottom: '0.2rem' }}>Instructions:</strong>
                        <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>"{order.instructions}"</span>
                    </div>
                )}
            </div>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
            <h4 style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Items</h4>
            {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '0.5rem', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    <span><b style={{ color: 'white' }}>{item.quantity}x</b> {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total Amount</p>
                <p style={{ color: 'var(--color-accent)', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                    ₹{order.total}
                </p>
            </div>
        </div>
    </motion.div>
);


const OrderStatusBadge = ({ status, estimatedTime }) => {
    let color = '#888';
    let icon = <Clock size={16} />;
    let text = status;

    switch (status) {
        case 'pending':
            color = 'var(--color-accent)'; // Gold
            icon = <Package size={16} />;
            text = 'Order Received';
            break;
        case 'preparing':
            color = 'var(--color-primary)'; // Red
            icon = <ChefHat size={16} />;
            text = estimatedTime ? `Cooking (~${estimatedTime})` : 'Cooking';
            break;
        case 'ready':
            color = '#2ecc71'; // Green
            icon = <CheckCircle size={16} />;
            text = 'Ready for Pickup';
            break;
        case 'completed':
            color = '#666';
            text = 'Completed';
            break;
    }

    return (
        <span style={{
            background: color,
            color: status === 'pending' ? 'black' : 'white',
            padding: '0.2rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
        }}>
            {icon} {text}
        </span>
    );
};

export default ClientOrders;
