import express from 'express';
import { saveAddress, getAddresses } from '../controllers/addressController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/save', verifyToken, saveAddress);
router.get('/get', verifyToken, getAddresses);

export default router; 