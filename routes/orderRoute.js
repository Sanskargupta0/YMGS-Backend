import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderRazorpay, placeOrderManual, allOrders, userOrders, updateStatus, updatePaymentStatus, verifyStripe, verifyRazorpay } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import optionalAuth from '../middleware/optionalAuth.js'

const orderRouter = express.Router()

//admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
orderRouter.post('/payment-status',adminAuth,updatePaymentStatus)

//payment features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)
orderRouter.post('/manual',authUser,placeOrderManual)

//user feature - using optional auth to support both logged-in users and email lookups
orderRouter.post('/userorders', optionalAuth, userOrders)

// verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)
export default orderRouter