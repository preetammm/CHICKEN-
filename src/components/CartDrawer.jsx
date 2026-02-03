import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/details';
import { sendOrderConfirmation } from '../services/notification';
import { X, Trash2, Plus, Minus } from 'lucide-react';

const CartDrawer = () => {
    const {
        isCartOpen, setIsCartOpen, cartItems,
        removeFromCart, updateQuantity, cartTotal, clearCart
    } = useCart();

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [isOrdering, setIsOrdering] = useState(false);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(''); // New Phone State
    const [instructions, setInstructions] = useState('');
    const [addressError, setAddressError] = useState(false);
    const [phoneError, setPhoneError] = useState(false); // New Phone Error State

    // Prefill data using helper from details (need to import getUserProfile)
    React.useEffect(() => {
        if (currentUser) {
            import('../services/details').then(({ getUserProfile }) => {
                getUserProfile(currentUser.uid).then(profile => {
                    if (profile?.phoneNumber) setPhone(profile.phoneNumber);
                    else if (currentUser.phoneNumber) setPhone(currentUser.phoneNumber);

                    if (profile?.address) setAddress(profile.address);
                });
            });
        }
    }, [currentUser, isCartOpen]); // Refresh when cart opens

    const handleCheckout = async () => {
        if (!currentUser) {
            alert("Please login to place an order!");
            setIsCartOpen(false);
            navigate('/login');
            return;
        }

        if (!address.trim()) {
            setAddressError(true);
        }
        if (!phone.trim()) {
            setPhoneError(true);
        }

        if (!address.trim() || !phone.trim()) {
            alert("Please provide both address and phone number.");
            return;
        }

        setIsOrdering(true);
        try {
            // Update Profile with latest info for next time
            import('../services/details').then(({ updateUserProfile }) => {
                updateUserProfile(currentUser.uid, {
                    address: address, // Save address too!
                    phoneNumber: phone
                });
            });

            // Create Order Object
            const orderDoc = await placeOrder({
                items: cartItems,
                total: cartTotal,
                userId: currentUser.uid,
                customerName: currentUser.displayName || currentUser.email,
                customerPhone: phone, // Add Phone to Order
                address: address,
                instructions: instructions,
                status: 'pending'
            });

            // alert("Order Placed Successfully! The shopkeeper has received it."); // REMOVED
            clearCart();
            setAddress('');
            setPhone(''); // Clear phone after order
            setInstructions('');
            setAddressError(false);
            setPhoneError(false); // Clear phone error
            setIsCartOpen(false);

            // Redirect to Success Page
            navigate('/order-success', {
                state: {
                    orderId: orderDoc.id,
                    orderTime: new Date().toLocaleString()
                }
            });

            // Send Notification (Simulation)
            sendOrderConfirmation({
                id: orderDoc.id,
                customerName: currentUser.displayName || currentUser.email,
                customerPhone: phone
            });

        } catch (error) {
            console.error(error);
            alert("Failed to place order. Please try again.");
        }
        setIsOrdering(false);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: 99 }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: "easeInOut" }}
                        style={{ position: 'fixed', top: 0, right: 0, width: '400px', height: '100%', background: '#1e1e1e', zIndex: 100, boxShadow: '-5px 0 15px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        </div>

                        {/* Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                            {cartItems.length === 0 ? <p style={{ color: '#888', textAlign: 'center' }}>Your cart is empty.</p> : (
                                <>
                                    {cartItems.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: '#2c2c2c', padding: '1rem', borderRadius: '8px' }}>
                                            <div style={{ width: '60px', height: '60px', background: `url(${item.image}) center/cover`, borderRadius: '4px' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <h4>{item.name}</h4>
                                                <p style={{ color: 'var(--color-accent)' }}>₹{item.price}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                                <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#444', borderRadius: '4px', padding: '2px' }}>
                                                    <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'transparent', border: 'none', color: 'white', padding: '0 5px', cursor: 'pointer' }}><Minus size={12} /></button>
                                                    <span style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'transparent', border: 'none', color: 'white', padding: '0 5px', cursor: 'pointer' }}><Plus size={12} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Address & Instructions Inputs */}
                                    <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>Delivery Details</h3>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number *</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Mobile Number"
                                                style={{ width: '100%', padding: '0.8rem', background: '#333', border: 'none', color: 'white', borderRadius: '8px', fontFamily: 'inherit' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', color: addressError ? '#ff4444' : '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Address *</label>
                                            <textarea
                                                value={address}
                                                onChange={(e) => {
                                                    setAddress(e.target.value);
                                                    if (e.target.value) setAddressError(false);
                                                }}
                                                placeholder="Enter full address..."
                                                style={{
                                                    width: '100%',
                                                    padding: '0.8rem',
                                                    background: '#333',
                                                    border: addressError ? '1px solid #ff4444' : 'none',
                                                    color: 'white',
                                                    borderRadius: '8px',
                                                    minHeight: '80px',
                                                    fontFamily: 'inherit',
                                                    outline: 'none'
                                                }}
                                            />
                                            {addressError && <small style={{ color: '#ff4444', marginTop: '0.2rem', display: 'block' }}>Please enter your delivery address.</small>}
                                        </div>

                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Instructions (Optional)</label>
                                            <input
                                                type="text"
                                                value={instructions}
                                                onChange={(e) => setInstructions(e.target.value)}
                                                placeholder="E.g. Extra spicy, Ring doorbell..."
                                                style={{ width: '100%', padding: '0.8rem', background: '#333', border: 'none', color: 'white', borderRadius: '8px', fontFamily: 'inherit' }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div style={{ padding: '2rem', borderTop: '1px solid #333', background: '#1a1a1a' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--color-accent)' }}>₹{cartTotal}</span>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    onClick={handleCheckout}
                                    disabled={isOrdering}
                                >
                                    {isOrdering ? 'Procesing...' : 'CHECKOUT NOW'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
