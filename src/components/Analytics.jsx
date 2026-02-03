import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Analytics = ({ orders }) => {
    // 1. Calculate Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    // 2. Prepare Data for Sales Chart (Last 7 orders for simplicity, or grouped by date)
    // Grouping by Date (DD/MM)
    const salesByDate = orders.reduce((acc, order) => {
        const date = order.createdAt?.seconds
            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
            : 'N/A';

        if (!acc[date]) acc[date] = 0;
        acc[date] += Number(order.total) || 0;
        return acc;
    }, {});

    const salesData = Object.keys(salesByDate).map(date => ({
        name: date,
        sales: salesByDate[date]
    })).slice(-7); // Show last 7 days/entries

    // 3. Prepare Data for Popular Items
    const itemCounts = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!itemCounts[item.name]) itemCounts[item.name] = 0;
            itemCounts[item.name] += item.quantity;
        });
    });

    const popularData = Object.keys(itemCounts).map(name => ({
        name,
        value: itemCounts[name]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 items

    const COLORS = ['#D90429', '#EF233C', '#FFC300', '#2B2D42', '#8D99AE'];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

            {/* SALES CHART */}
            <div style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '16px', border: '1px solid #333' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Revenue Trend</h3>
                <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                            <YAxis stroke="#888" tick={{ fill: '#888' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#252525', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: 'white' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center', color: '#ccc' }}>
                    Total Revenue: <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>₹{totalRevenue}</span>
                </div>
            </div>

            {/* POPULAR ITEMS */}
            <div style={{ background: '#1e1e1e', padding: '1.5rem', borderRadius: '16px', border: '1px solid #333' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Top 5 Sellers</h3>
                <div style={{ height: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={popularData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {popularData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#252525', border: 'none', borderRadius: '8px', color: 'white' }}
                            />
                            <Legend wrapperStyle={{ color: '#ccc' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Analytics;
