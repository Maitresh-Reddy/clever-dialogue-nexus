// auth_route.js
import express from 'express';
import {
  registerUser,
  forgotPassword,
  verifyForgotPasswordOtp,
  loginUser,
  resetPassword,
  verifyRegisterOtp,
  adminSignup,
  resetPasswordAdmin,
  forgotPasswordAdmin,
  loginAdmin,
  verifyAdminRegisterOtp,
  employeeSignup,
  verifyEmployeeRegisterOtp,
  employeeLogin,
  forgotPasswordEmployee,
  resetEmployeePassword
} from '../controller/authController.js';

const router = express.Router();

router.post('/registerUser', registerUser);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyForgotPasswordOtp', verifyForgotPasswordOtp);
router.post('/loginUser', loginUser);
router.post('/resetPassword', resetPassword);
router.post('/adminSignup', adminSignup);
router.post('/verifyRegisterOtp', verifyRegisterOtp);
router.post('/resetPasswordAdmin', resetPasswordAdmin);
router.post('/forgotPasswordAdmin', forgotPasswordAdmin);
router.post('/loginAdmin', loginAdmin);
router.post('/verifyAdminRegisterOtp', verifyAdminRegisterOtp);
router.post('/employeeSignup',employeeSignup);
router.post('verifyEmployeeRegisterOtp',verifyEmployeeRegisterOtp);
router.post('/employeeLogin',employeeLogin);
router.post('/forgotPasswordEmployee',forgotPasswordEmployee);
router.post('/resetEmployeePassword',resetEmployeePassword);


export default router;