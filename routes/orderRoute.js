import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderRazorpay, placeOrderManual, allOrders, userOrders, updateStatus, updatePaymentStatus, verifyStripe, verifyRazorpay } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

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

//user feature
orderRouter.post('/userorders', authUser, userOrders)

// verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)
export default orderRouter