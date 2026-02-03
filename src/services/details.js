import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';

// --- PRODUCTS ---

export const getProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToProducts = (callback) => {
    const q = query(collection(db, "products"));
    return onSnapshot(q, (snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(products);
    });
};

// Seed utility (only for dev)
export const seedProducts = async () => {
    const products = [
        { name: "Whole Chicken", price: 150, category: "Raw", stock: true, image: "https://images.unsplash.com/photo-1587593810167-a6492031e5fd?q=80&w=2072&auto=format&fit=crop" },
        { name: "Chicken Breast", price: 220, category: "Raw", stock: true, image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=1889&auto=format&fit=crop" },
        { name: "Spicy Wings", price: 180, category: "Marinated", stock: true, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1980&auto=format&fit=crop" },
        { name: "Drumsticks (6pc)", price: 140, category: "Raw", stock: true, image: "https://images.unsplash.com/photo-1588723205383-206ae91302b4?q=80&w=1886&auto=format&fit=crop" }
    ];

    for (const p of products) {
        await addDoc(collection(db, "products"), p);
    }
    console.log("Seeding complete!");
};

export const addProduct = async (productData) => {
    await addDoc(collection(db, "products"), {
        ...productData,
        stock: true, // Default to in-stock
        createdAt: new Date()
    });
};

export const deleteProduct = async (productId) => {
    await deleteDoc(doc(db, "products", productId));
};

export const toggleStock = async (productId, currentStatus) => {
    await updateDoc(doc(db, "products", productId), {
        stock: !currentStatus
    });
};

// --- ORDERS ---

export const placeOrder = async (orderData) => {
    // orderData: { items: [], total: 100, status: 'pending', customerId: '...', createdAt: Date }
    return await addDoc(collection(db, "orders"), {
        ...orderData,
        status: 'pending',
        createdAt: new Date()
    });
};

export const subscribeToOrders = (callback) => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(orders);
    });
};

export const updateOrderStatus = async (orderId, status, additionalData = {}) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status, ...additionalData });
};

export const subscribeToClientOrders = (userId, callback) => {
    const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(orders);
    });
};

// --- USERS ---

export const subscribeToUsers = (callback) => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(users);
    });
};

// Update existing or add new
export const getUserProfile = async (userId) => {
    const docSnap = await getDoc(doc(db, "users", userId));
    return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (userId, data) => {
    await updateDoc(doc(db, "users", userId), data);
};

export const updateUserRole = async (userId, newRole) => {
    await updateDoc(doc(db, "users", userId), {
        role: newRole
    });
};
