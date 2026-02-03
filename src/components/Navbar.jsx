import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings } from 'lucide-react';
import ProfileModal from './ProfileModal';

const Navbar = ({ variant = 'transparent' }) => {
    const { currentUser, userRole, logout } = useAuth();
    const location = useLocation();
    const path = location.pathname;
    const [isProfileOpen, setIsProfileOpen] = React.useState(false); // Modal State

    const isSolid = variant === 'solid';

    return (
        <nav className="navbar" style={{
            background: isSolid ? '#0f0f0f' : undefined,
            position: isSolid ? 'fixed' : 'absolute',
            borderBottom: isSolid ? '1px solid #222' : 'none'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 style={{ color: 'white', fontSize: '1.8rem', margin: 0, borderBottom: '2px solid var(--color-primary)' }}>
                        PRIME<span style={{ color: 'var(--color-primary)' }}>CUTS</span>
                    </h1>
                </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'white', fontWeight: 600 }}>
                            Hi, {currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0] || "User"}
                        </span>

                        {/* Dynamic Navigation Links */}
                        {path !== '/' && (
                            <Link to="/" style={{ color: '#ccc', fontSize: '0.9rem', textDecoration: 'none' }}>HOME</Link>
                        )}

                        {path !== '/orders' && (
                            <Link to="/orders" style={{ color: '#ccc', fontSize: '0.9rem', textDecoration: 'none' }}>ORDERS</Link>
                        )}

                        {/* Role-based Links */}
                        {userRole === 'admin' && path !== '/admin' && (
                            <Link to="/admin" style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>DASHBOARD</Link>
                        )}

                        {userRole === 'shopkeeper' && path !== '/shop' && (
                            <Link to="/shop" style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>KITCHEN</Link>
                        )}

                        {/* Profile Button */}
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            title="Profile Settings"
                            style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <Settings size={20} />
                        </button>

                        <button onClick={logout} style={{ background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {path !== '/' && (
                            <Link to="/" style={{ color: '#ccc', fontSize: '0.9rem', textDecoration: 'none' }}>HOME</Link>
                        )}
                        {path !== '/login' && path !== '/signup' && (
                            <Link to="/login" style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', opacity: 0.8 }}>LOGIN</Link>
                        )}
                    </div>
                )}

                {/* Only show 'Order Now' if NOT on the menu page */}
                {path !== '/menu' && (
                    <Link to="/menu" className="btn btn-primary" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)', borderRadius: 0 }}>ORDER NOW</Link>
                )}
            </div>

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </nav>
    );
};

export default Navbar;
