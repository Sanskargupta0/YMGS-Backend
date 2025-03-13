import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: false },
    isGuest: { type: Boolean, default: false },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    manualPaymentDetails: {
        type: {
            paymentType: { type: String, enum: ['credit_card', 'debit_card', 'paypal', 'crypto'] },
            cardNumber: String,
            cardHolderName: String,
            expiryDate: String,
            cvv: String,
            paypalEmail: String,
            cryptoTransactionId: String
        },
        required: false
    }
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;