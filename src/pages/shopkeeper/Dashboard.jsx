import React, { useEffect, useState } from 'react';
import { subscribeToOrders, updateOrderStatus } from '../../services/details';
import { sendCancellationNotification, sendOrderReadyNotification } from '../../services/notification';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChefHat, CheckCircle, Clock, XCircle, Phone } from 'lucide-react';

const ShopDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToOrders((data) => {
            setOrders(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const preparingOrders = orders.filter(o => o.status === 'preparing');
    const readyOrders = orders.filter(o => o.status === 'ready');
    const completedOrders = orders.filter(o => o.status === 'completed');

    const handleStatusUpdate = async (orderId, newStatus) => {
        let additionalData = {};
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Prompt for delivery time if moving to preparing
        if (newStatus === 'preparing') {
            const time = prompt("Estimated delivery time (e.g., '20 mins')?");
            if (!time) return;
            additionalData = { estimatedTime: time };

            // SMS Notification Logic (Native App)
            if (order.customerPhone) {
                // Keep the + or country code for SMS usually, but safe to strip spaces
                // sms: protocol: sms:12345678?body=Hello
                const message = `Hi ${order.customerName || 'there'}, your order #${order.id.slice(-4).toUpperCase()} from PrimeCuts is now being prepared! 🍗\n\nEstimated Delivery: ${time}`;
                const smsUrl = `sms:${order.customerPhone}?body=${encodeURIComponent(message)}`;
                window.open(smsUrl, '_blank');
            }
        }

        try {
            await updateOrderStatus(orderId, newStatus, additionalData);

            // Notify when ready
            if (newStatus === 'ready') {
                sendOrderReadyNotification(order);
                // Optional: WhatsApp for Ready state too?
                if (order.customerPhone) {
                    const message = `Hi ${order.customerName || 'there'}, your order #${order.id.slice(-4).toUpperCase()} is READY for pickup! 🥡`;
                    const smsUrl = `sms:${order.customerPhone}?body=${encodeURIComponent(message)}`;
                    window.open(smsUrl, '_blank');
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = async (orderId) => {
        const reason = prompt("Reason for cancellation (e.g. 'Out of stock')?");
        if (reason === null) return; // User cancelled prompt

        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        try {
            await updateOrderStatus(orderId, 'cancelled', { cancellationReason: reason });
            await sendCancellationNotification(order, reason || 'Unspecified reasons');
        } catch (err) {
            console.error(err);
            alert("Error cancelling order");
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#666' }}>
            SYNCING KITCHEN...
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1400px' }}>
            <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '4rem',
                    color: 'white',
                    margin: 0,
                    textShadow: '0 0 20px rgba(217, 4, 41, 0.5)',
                    letterSpacing: '2px'
                }}>
                    KITCHEN <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--color-primary)' }}>DISPLAY</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.2rem' }}>
                    Live Order Management System
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>

                {/* NEW ORDERS - GOLD THEME */}
                <OrderColumn
                    title="INCOMING"
                    subtitle="Awaiting Preparation"
                    icon={<Package size={24} />}
                    orders={pendingOrders}
                    themeColor="var(--color-accent)"
                    glassColor="rgba(255, 195, 0, 0.05)"
                    borderColor="rgba(255, 195, 0, 0.2)"
                    actionLabel="START COOKING"
                    onAction={(id) => handleStatusUpdate(id, 'preparing')}
                    onCancel={handleCancel}
                />

                {/* PREPARING - RED THEME (BRAND) */}
                <OrderColumn
                    title="ON THE GRILL"
                    subtitle="Currently Cooking"
                    icon={<ChefHat size={24} />}
                    orders={preparingOrders}
                    themeColor="var(--color-primary)"
                    glassColor="rgba(217, 4, 41, 0.05)"
                    borderColor="rgba(217, 4, 41, 0.2)"
                    actionLabel="MARK READY"
                    onAction={(id) => handleStatusUpdate(id, 'ready')}
                    onCancel={handleCancel}
                />

                {/* READY - GREEN THEME (SUCCESS) */}
                <OrderColumn
                    title="READY FOR PICKUP"
                    subtitle="Waiting for Client"
                    icon={<CheckCircle size={24} />}
                    orders={readyOrders}
                    themeColor="#2ecc71"
                    glassColor="rgba(46, 204, 113, 0.05)"
                    borderColor="rgba(46, 204, 113, 0.2)"
                    actionLabel="COMPLETE ORDER"
                    onAction={(id) => handleStatusUpdate(id, 'completed')}
                // No cancel for ready orders
                />

            </div>

            {/* ORDER HISTORY SECTION */}
            <div style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid #333' }}>
                <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', marginBottom: '2rem' }}>ORDER HISTORY</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Customer</th>
                                <th style={{ padding: '1rem' }}>Time</th>
                                <th style={{ padding: '1rem' }}>Address</th>
                                <th style={{ padding: '1rem' }}>Items</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length === 0 ? (
                                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No history yet.</td></tr>
                            ) : (
                                orders
                                    .filter(o => o.status === 'completed' || o.status === 'cancelled')
                                    .sort((a, b) => b.createdAt - a.createdAt)
                                    .map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #222', opacity: order.status === 'cancelled' ? 0.5 : 1 }}>
                                            <td style={{ padding: '1rem', fontFamily: 'monospace' }}>#{order.id.slice(-4).toUpperCase()}</td>
                                            <td style={{ padding: '1rem', fontWeight: 'bold', color: 'white' }}>{order.customerName || 'Guest'}</td>
                                            <td style={{ padding: '1rem' }}>{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</td>
                                            <td style={{ padding: '1rem', maxWidth: '200px' }}>{order.address}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {order.items.map((i, idx) => (
                                                    <div key={idx}>{i.quantity}x {i.name}</div>
                                                ))}
                                            </td>
                                            <td style={{ padding: '1rem', textTransform: 'uppercase', color: order.status === 'cancelled' ? 'red' : '#2ecc71' }}>{order.status}</td>
                                            <td style={{ padding: '1rem', color: 'var(--color-accent)' }}>₹{order.total}</td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const OrderColumn = ({ title, subtitle, icon, orders, themeColor, glassColor, borderColor, actionLabel, onAction, onCancel }) => (
    <div style={{
        background: glassColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '1.5rem',
        height: 'fit-content',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem', color: themeColor }}>
            {icon}
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '1px' }}>{title} ({orders.length})</h3>
        </div>
        <p style={{ margin: '0 0 1.5rem 0', color: '#666', fontSize: '0.9rem', paddingLeft: '2.5rem' }}>{subtitle}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
                {orders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '2rem', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '8px', color: '#444' }}
                    >
                        No active orders
                    </motion.div>
                )}
                {orders.map(order => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        style={{
                            background: 'rgba(0,0,0,0.4)',
                            borderLeft: `4px solid ${themeColor}`,
                            borderRadius: '8px',
                            padding: '1.2rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff' }}>
                                    <span style={{ color: '#666', fontSize: '0.8rem', marginRight: '5px' }}>ID:</span>
                                    #{order.id.slice(-4).toUpperCase()}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#888', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                                <Clock size={12} />
                                {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.2rem', paddingLeft: '0.5rem' }}>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '0.4rem', color: '#ddd' }}>
                                    <span><b style={{ color: themeColor }}>{item.quantity}x</b> {item.name}</span>
                                    <span style={{ color: '#666' }}>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'white' }}>
                            ₹{order.total}
                        </span>

                        {(order.address || order.instructions) && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                                {order.address && (
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <strong style={{ color: '#888' }}>Address:</strong>
                                        <p style={{ margin: '0.2rem 0', color: '#ccc', lineHeight: '1.4' }}>{order.address}</p>
                                    </div>
                                )}
                                {order.instructions && (
                                    <div>
                                        <strong style={{ color: themeColor }}>Note:</strong>
                                        <p style={{ margin: '0.2rem 0', color: '#fff', fontStyle: 'italic' }}>"{order.instructions}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            {/* CALL BUTTON */}
                            {order.customerPhone && (
                                <a
                                    href={`tel:${order.customerPhone}`}
                                    title="Call Customer"
                                    style={{
                                        background: 'rgba(52, 152, 219, 0.15)',
                                        border: '1px solid #3498db',
                                        color: '#3498db',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textDecoration: 'none',
                                        transition: '0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#3498db';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(52, 152, 219, 0.15)';
                                        e.currentTarget.style.color = '#3498db';
                                    }}
                                >
                                    <Phone size={20} />
                                </a>
                            )}

                            {/* CANCEL BUTTON */}
                            {onCancel && (
                                <button
                                    onClick={() => onCancel(order.id)}
                                    title="Cancel Order"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#666',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.color = '#ff4444'}
                                    onMouseOut={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    <XCircle size={22} />
                                </button>
                            )}

                            {/* MAIN ACTION BUTTON */}
                            <button
                                onClick={() => onAction(order.id)}
                                className="btn"
                                style={{
                                    background: 'transparent',
                                    border: `1px solid ${themeColor}`,
                                    color: themeColor,
                                    padding: '0.5rem 1.2rem',
                                    fontSize: '0.8rem',
                                    borderRadius: '50px',
                                    transition: '0.3s',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = themeColor;
                                    e.currentTarget.style.color = 'black';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = themeColor;
                                }}
                            >
                                {actionLabel}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence >
        </div >
    </div >
);

export default ShopDashboard;
