import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const GlobalNavigation = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    if (isAuthPage) return null;

    return (
        <>
            <Navbar variant={isHome ? 'transparent' : 'solid'} />
            {/* Add spacer for solid navbar to prevent content overlap */}
            {!isHome && <div style={{ height: '80px' }}></div>}
        </>
    );
};

export default GlobalNavigation;
