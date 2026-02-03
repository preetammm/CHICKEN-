// Simulated Notification Service
// In a real app, this would call an API like EmailJS, Twilio, or Firebase Cloud Functions

export const sendOrderConfirmation = async (order) => {
    console.log(`[EMAIL SENT] To: ${order.customerName} | Subject: Order #${order.id} Confirmed!`);
    // In a real implementation: emailjs.send(...)
};

export const sendCancellationNotification = async (order, reason) => {
    const message = `Hi ${order.customerName}, sorry but your order #${order.id.slice(-4).toUpperCase()} from PrimeCuts was cancelled. Reason: ${reason}`;

    console.log(`[SMS SENT] To Customer: ${message}`);
    alert(`(Simulation) SMS sent to customer:\n\n"${message}"`);
    // In a real implementation: twilio.messages.create(...)
};

export const sendOrderReadyNotification = async (order) => {
    const message = `Hi ${order.customerName}, good news! Your order #${order.id.slice(-4).toUpperCase()} is READY for pickup!`;
    console.log(`[SMS SENT] To Customer: ${message}`);
    // Optional: Alert shopkeeper that notification was sent
};
