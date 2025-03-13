// placing orders using COD

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import crypto from "crypto";

// global variables
const currency = 'usd'
const deliveryCharge = 35

// GATEWAY INTIALIZE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_SECRET_KEY
})


const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        
        if (!items || items.length === 0) {
            return res.json({success: false, message: "No items in cart"});
        }

        const orderData = {
            userId,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// placing orders using stripe

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers

        if (!items || items.length === 0) {
            return res.json({success: false, message: "No items in cart"});
        }

        const orderData = {
            userId,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            status: "Order Placed",
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                    images: [item.image]
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100 
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success: true, session_url:session.url})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// verify stripe
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// placing orders using razor

const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!items || items.length === 0) {
            return res.json({success: false, message: "No items in cart"});
        }

        const orderData = {
            userId,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            status: "Order Placed",
            date: new Date()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount*100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message:error})
            }
            res.json({success:true, order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const verifyRazorpay = async (req, res) => {
    try {
        const { userId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

        // Verify the payment
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        // Create signature verification data
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        // Verify signature
        if (generated_signature === razorpay_signature) {
            if (orderInfo.status === 'paid') {
                await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true});
                await userModel.findByIdAndUpdate(userId, {cartData: {}})
                res.json({ success: true, message: "Payment Successful" })
            } else {
                res.json({ success: false, message: "Payment Failed" })
            }
        } else {
            res.json({ success: false, message: "Invalid signature" })
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// placing orders using manual payment
const placeOrderManual = async (req, res) => {
    try {
        const { userId, items, amount, address, manualPaymentDetails } = req.body;
        
        if (!items || items.length === 0) {
            return res.json({success: false, message: "No items in cart"});
        }

        // Validate payment details based on payment type
        if (!manualPaymentDetails || !manualPaymentDetails.paymentType) {
            return res.json({success: false, message: "Payment type is required"});
        }

        if (manualPaymentDetails.paymentType === 'paypal' && !manualPaymentDetails.paypalEmail) {
            return res.json({success: false, message: "PayPal email is required"});
        }

        if (['credit_card', 'debit_card'].includes(manualPaymentDetails.paymentType)) {
            if (!manualPaymentDetails.cardNumber || !manualPaymentDetails.cardHolderName || 
                !manualPaymentDetails.expiryDate || !manualPaymentDetails.cvv) {
                return res.json({success: false, message: "All card details are required"});
            }
        }
        
        if (manualPaymentDetails.paymentType === 'crypto') {
            if (!manualPaymentDetails.cryptoTransactionId) {
                return res.json({success: false, message: "Crypto transaction ID is required"});
            }
        }

        const orderData = {
            userId,
            items: items.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            address,
            amount,
            paymentMethod: "Manual",
            payment: false,
            status: "Order Placed",
            date: new Date(),
            manualPaymentDetails
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order placed successfully. Our customer representative will confirm your payment. Thank you for ordering."})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// all orders for admin panel

const allOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            startDate,
            endDate,
            email,
            paymentType,
            amount,
            status,
            paymentStatus
        } = req.body;

        // Build filter query
        let query = {};

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            };
        }

        if (email) {
            query['address.email'] = { $regex: email, $options: 'i' };
        }

        if (paymentType) {
            query.paymentMethod = paymentType;
        }

        if (amount) {
            query.amount = parseFloat(amount);
        }

        if (status) {
            query.status = status;
        }

        if (paymentStatus !== undefined && paymentStatus !== '') {
            query.payment = paymentStatus === 'true';
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalOrders = await orderModel.countDocuments(query);

        // Get filtered and paginated orders
        const orders = await orderModel.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            orders,
            pagination: {
                total: totalOrders,
                pages: Math.ceil(totalOrders / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// user orders data for front end

const userOrders = async (req, res) => {
    try {
        const { userId, email, page = 1, limit = 5 } = req.body;
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        let query = {};
        
        // If user is logged in, find by userId
        if (userId) {
            query.userId = userId;
        } 
        // If looking up by email (for non-logged-in users)
        else if (email) {
            query['address.email'] = email;
        } else {
            return res.json({ success: false, message: "User ID or email is required" });
        }
        
        // Get total count for pagination
        const totalOrders = await orderModel.countDocuments(query);
        
        // Get orders with pagination
        const orders = await orderModel.find(query)
            .sort({ date: -1 }) // Latest orders first
            .skip(skip)
            .limit(parseInt(limit));
            
        res.json({
            success: true, 
            orders,
            pagination: {
                total: totalOrders,
                pages: Math.ceil(totalOrders / parseInt(limit)),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

// update order status from admin panel

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success: true, message: "Order status updated successfully"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// update payment status from admin panel
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, payment } = req.body

        await orderModel.findByIdAndUpdate(orderId, { payment })
        res.json({success: true, message: "Payment status updated successfully"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, placeOrderManual, allOrders, userOrders, updateStatus, updatePaymentStatus }

