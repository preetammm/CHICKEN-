import React, { useState, useEffect } from 'react';
import { addProduct, subscribeToProducts, deleteProduct, toggleStock, subscribeToOrders, subscribeToUsers, updateUserRole } from '../../services/details';
import { Trash2, Plus, RefreshCw } from 'lucide-react';
import Analytics from '../../components/Analytics';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]); // Add users state
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Raw', image: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubProducts = subscribeToProducts((data) => setProducts(data));
        const unsubOrders = subscribeToOrders((data) => setOrders(data));
        const unsubUsers = subscribeToUsers((data) => setUsers(data));
        return () => {
            unsubProducts();
            unsubOrders();
            unsubUsers();
        };
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                await updateUserRole(userId, newRole);
                alert("User role updated!");
            } catch (error) {
                console.error("Error updating role:", error);
                alert("Failed to update user role.");
            }
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        setLoading(true);
        try {
            await addProduct({
                ...newProduct,
                price: Number(newProduct.price)
            });
            setNewProduct({ name: '', price: '', category: 'Raw', image: '' }); // Reset form
            alert("Product Added!");
        } catch (error) {
            console.error(error);
            alert("Error adding product");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            await deleteProduct(id);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>ADMIN PANEL</h1>
                <p style={{ color: '#888' }}>manage inventory, prices & users</p>
            </header>

            {/* ANALYTICS SECTION */}
            <Analytics orders={orders} />

            {/* USERS MANAGEMENT SECTION */}
            <div style={{ marginBottom: '3rem', background: '#1e1e1e', padding: '2rem', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>User Management ({users.length})</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444', color: '#888' }}>
                                <th style={{ padding: '0.8rem' }}>Name</th>
                                <th style={{ padding: '0.8rem' }}>Email</th>
                                <th style={{ padding: '0.8rem' }}>Role</th>
                                <th style={{ padding: '0.8rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                                    <td style={{ padding: '0.8rem', color: 'white' }}>{user.displayName || 'N/A'}</td>
                                    <td style={{ padding: '0.8rem' }}>{user.email}</td>
                                    <td style={{ padding: '0.8rem' }}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                            background: user.role === 'admin' ? 'rgba(217, 4, 41, 0.2)' : user.role === 'shopkeeper' ? 'rgba(255, 195, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            color: user.role === 'admin' ? 'var(--color-primary)' : user.role === 'shopkeeper' ? 'var(--color-accent)' : '#ccc'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.8rem' }}>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            style={{ background: '#333', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            <option value="client">Client</option>
                                            <option value="shopkeeper">Shopkeeper</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gap: '3rem' }}>

                {/* LEFT: ADD PRODUCT FORM */}
                <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '8px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Add New Item</h3>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Name</label>
                            <input
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                placeholder="e.g. Chicken Lollipops"
                                style={{ width: '100%', padding: '0.8rem', background: '#333', border: 'none', color: 'white' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Price (₹)</label>
                                <input
                                    type="number"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    placeholder="250"
                                    style={{ width: '100%', padding: '0.8rem', background: '#333', border: 'none', color: 'white' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Category</label>
                                <select
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', background: '#333', border: 'none', color: 'white' }}
                                >
                                    <option value="Raw">Raw Meat</option>
                                    <option value="Marinated">Marinated</option>
                                    <option value="Ready">Ready to Cook</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem' }}>Image URL</label>
                            <input
                                value={newProduct.image}
                                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                placeholder="https://..."
                                style={{ width: '100%', padding: '0.8rem', background: '#333', border: 'none', color: 'white' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                            {loading ? 'Adding...' : 'ADD PRODUCT'}
                        </button>
                    </form>
                </div>

                {/* RIGHT: PRODUCT LIST */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Current Inventory ({products.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                        {products.map(p => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#252525', padding: '1rem', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', background: `url(${p.image}) center/cover`, borderRadius: '4px' }}></div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{p.name}</h4>
                                        <span style={{ color: 'var(--color-accent)' }}>₹{p.price}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        onClick={() => toggleStock(p.id, p.stock)}
                                        className="btn"
                                        style={{
                                            background: p.stock ? 'rgba(50, 205, 50, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                                            color: p.stock ? '#32CD32' : 'red',
                                            fontSize: '0.8rem',
                                            padding: '0.4rem 0.8rem'
                                        }}
                                    >
                                        {p.stock ? 'In Stock' : 'Out of Stock'}
                                    </button>

                                    <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>

            {/* ADMIN ORDER HISTORY */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'white' }}>All Orders History</h3>
                    <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>

                <div style={{ overflowX: 'auto', background: '#1a1a1a', borderRadius: '8px', padding: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444', color: '#888' }}>
                                <th style={{ padding: '0.8rem' }}>Date</th>
                                <th style={{ padding: '0.8rem' }}>Customer</th>
                                <th style={{ padding: '0.8rem' }}>Items</th>
                                <th style={{ padding: '0.8rem' }}>Total</th>
                                <th style={{ padding: '0.8rem' }}>Status</th>
                                <th style={{ padding: '0.8rem' }}>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No orders found.</td></tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                                        <td style={{ padding: '0.8rem' }}>{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                        <td style={{ padding: '0.8rem', color: 'white' }}>{order.customerName}</td>
                                        <td style={{ padding: '0.8rem' }}>
                                            {order.items.map((i, idx) => (
                                                <div key={idx} style={{ marginBottom: '2px' }}>{i.quantity} x {i.name}</div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '0.8rem', color: 'var(--color-accent)' }}>₹{order.total}</td>
                                        <td style={{ padding: '0.8rem' }}>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                background: order.status === 'completed' ? 'rgba(50,205,50,0.2)' : order.status === 'pending' ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)',
                                                color: order.status === 'completed' ? '#32CD32' : order.status === 'pending' ? 'gold' : '#ccc'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.8rem', maxWidth: '250px', fontSize: '0.85rem', color: '#888' }}>{order.address}</td>
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

export default AdminDashboard;
