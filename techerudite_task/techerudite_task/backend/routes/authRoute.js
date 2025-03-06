// routes/authRoutes.js
import express from 'express';
import { loginUser, registerUser, verifyEmail } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register',registerUser);  
router.post('/login', loginUser);   
router.post('/verify-email', verifyEmail);       
  

export default router;
