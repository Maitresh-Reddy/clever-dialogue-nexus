import dotenv from 'dotenv';
// import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/email.js';
import { getDB } from '../utils/db.js';
import { log } from 'node:console';

dotenv.config();

const saltRounds = 10;

export const registerUser = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

    try {
        const { otpCollection } = await getDB();
        const emailDomain = email.split('@')[1];
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ message: 'Email domain not allowed.' });
        }

        await otpCollection.deleteMany({ email });

        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords mismatch' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        const insertResult = await otpCollection.insertOne({
            name:name,
            email:email,
            password: hashedPassword,
            otp:otp,
            expires_at: expirationTime,
            verified: false,
        });

        const emailBody = `Your OTP code is: ${otp}`;
        await sendEmail(email, 'Account Verification OTP', emailBody);

        res.status(200).json({ message: 'Email sent' });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Registration failed.', error });
    }
};

export const verifyRegisterOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(email,otp);
    
    try {
        const { otpCollection, collection } = await getDB();
        const emailLower = email.toLowerCase();
        console.log(emailLower);
        // console.log(otpCollection);
        
        const otpRecord = await otpCollection.findOne({ email: email, otp: otp });
        console.log(otpRecord);
        
        if (!otpRecord || new Date() > otpRecord.expires_at) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const userData = {
            name: otpRecord.name,
            email: emailLower,
            password: otpRecord.password,
        };

        await collection.insertOne(userData);
        await otpCollection.deleteOne({ email: emailLower, otp });

        res.status(200).json({ success: true, message: 'Signup successful' });

    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const adminSignup = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com','anurag.edu.in'];

    try {
        const { otpCollection } = await getDB();
        const emailDomain = email.split('@')[1];

        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ message: 'Email domain not allowed.' });
        }

        await otpCollection.deleteMany({ email });

        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords mismatch' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        await otpCollection.insertOne({
            name:name,
            email:email,
            password: hashedPassword,
            otp:otp,
            expires_at: expirationTime,
            verified: false,
        });

        const emailBody = `Your OTP code is: ${otp}`;
        await sendEmail(email, 'Admin Verification OTP', emailBody);

        res.status(200).json({ message: 'Email sent' });

    } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error });
    }
};

export const verifyAdminRegisterOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const { otpCollection, Admincollection } = await getDB();
        const emailLower = email.toLowerCase();

        const otpRecord = await otpCollection.findOne({ email: emailLower, otp });
        if (!otpRecord || new Date() > otpRecord.expires_at) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const userData = {
            name: otpRecord.name,
            email: emailLower,
            password: otpRecord.password,
        };

        await Admincollection.insertOne(userData);
        await otpCollection.deleteOne({ email: emailLower, otp });

        res.status(200).json({ success: true, message: 'Signup successful' });

    } catch (err) {
        console.error("Admin OTP Error:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    const { collection } = await getDB();
    const { email, password } = req.body;

    try {
        const user = await collection.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        console.log(`User logged in successfully: ${email}`);
        return res.status(200).send('User logged in successfully');

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Login failed.', error });
    }
};

export const loginAdmin = async (req, res) => {
    const { Admincollection } = await getDB();
    const { email, password } = req.body;

    try {
        const admin = await Admincollection.findOne({ email });
        if (!admin) return res.status(400).json({ message: 'Admin not found' });

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        return res.status(200).send('Admin logged in successfully');

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: 'Login failed.', error });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const { collection, otpCollection } = await getDB();

    try {
        const user = await collection.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        await otpCollection.deleteMany({ email });
        await otpCollection.insertOne({ email, otp, expires_at: expirationTime });

        await sendEmail(email, 'Password Reset OTP', `Your OTP code is: ${otp}`);

        res.status(200).json({ message: 'Password email sent.' });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: 'Error processing request.', error });
    }
};

export const forgotPasswordAdmin = async (req, res) => {
    const { email } = req.body;
    const { Admincollection, otpCollection } = await getDB();

    try {
        const admin = await Admincollection.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        await otpCollection.deleteMany({ email });
        await otpCollection.insertOne({ email, otp, expires_at: expirationTime });

        await sendEmail(email, 'Admin Password Reset OTP', `Your OTP code is: ${otp}`);

        res.status(200).json({ message: 'Password email sent.' });

    } catch (error) {
        console.error("Forgot Admin Password Error:", error);
        res.status(500).json({ message: 'Error processing request.', error });
    }
};

export const verifyForgotPasswordOtp = async (req, res) => {
    const { email, otp } = req.body;
    const emailLower = email.toLowerCase();
    const { otpCollection } = await getDB();

    try {
        const otpRecord = await otpCollection.findOne({ email: emailLower, otp });

        if (!otpRecord || new Date() > otpRecord.expires_at) {
            return res.status(401).send('Invalid or expired OTP');
        }

        res.status(200).json({ success: true, message: "OTP verified, proceed to change password" });

    } catch (err) {
        console.error("Verify OTP Error:", err);
        res.status(500).send('Internal server error');
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const { collection } = await getDB();

    try {
        const user = await collection.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await collection.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Password reset failed', error });
    }
};

export const resetPasswordAdmin = async (req, res) => {
    const { email, newPassword } = req.body;
    const { Admincollection } = await getDB();

    try {
        const admin = await Admincollection.findOne({ email });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await Admincollection.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        res.status(200).json({ message: 'Admin password reset successfully' });

    } catch (error) {
        console.error("Reset Admin Password Error:", error);
        res.status(500).json({ message: 'Password reset failed', error });
    }
};

export const employeeSignup= async (req,res)=>{
     const { name,employeeID,email, password, confirmpassword } = req.body;
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

    try {
        const { otpCollection } = await getDB();
        const emailDomain = email.split('@')[1];
        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ message: 'Email domain not allowed.' });
        }

        await otpCollection.deleteMany({ email });

        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords mismatch' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        const insertResult = await otpCollection.insertOne({
            name:name,
            employeeID:employeeID,
            email:email,
            password: hashedPassword,
            otp:otp,
            expires_at: expirationTime,
            verified: false,
        });

        const emailBody = `Your OTP code is: ${otp}`;
        await sendEmail(email, 'Account Verification OTP', emailBody);

        res.status(200).json({ message: 'Email sent' });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Registration failed.', error });
    }

}

export const verifyEmployeeRegisterOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const { otpCollection, Admincollection } = await getDB();
        const emailLower = email.toLowerCase();

        const otpRecord = await otpCollection.findOne({ email: emailLower, otp });
        if (!otpRecord || new Date() > otpRecord.expires_at) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const userData = {
            name: otpRecord.name,
            employeeID:otpRecord.employeeID,
            email: emailLower,
            password: otpRecord.password,
        };

        await Employeecollection.insertOne(userData);
        await otpCollection.deleteOne({ email: emailLower, otp });

        res.status(200).json({ success: true, message: 'Signup successful' });

    } catch (err) {
        console.error("Admin OTP Error:", err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const employeeLogin=async (req,res)=>{
    const {employeeID,password}=req.body;
    try
    {
    const {Employeecollection}=await getDB();
    
    const employee=await Employeecollection.findOne({employeeID});

    if(!employee)
        res.status(500).json({message:"ID not found"});
    const isPasswordValid=bcrypt.compare(password,employee.password);
    if(!isPasswordValid)
        res.status(500).json({message:"Invalid password"});
    res.status(200).json({message:"Login Successful"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message:"exception"});
        
    }
}

export const forgotPasswordEmployee = async (req, res) => {
    const { email } = req.body;
    const { Employeecollection, otpCollection } = await getDB();

    try {
        const employee = await Employeecollection.findOne({ email });
        if (!employee) return res.status(404).json({ message: 'employee not found.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        await otpCollection.deleteMany({ email });
        await otpCollection.insertOne({ email, otp, expires_at: expirationTime });

        await sendEmail(email, 'Password Reset OTP', `Your OTP code is: ${otp}`);

        res.status(200).json({ message: 'Password email sent.' });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: 'Error processing request.', error });
    }
};


export const resetEmployeePassword=async (req,res)=>{
    const { employeeID, newPassword } = req.body;
    const { Employeecollection } = await getDB();

    try {
        const employee = await Employeecollection.findOne({ employeeID });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await Employeecollection.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        res.status(200).json({ message: 'Admin password reset successfully' });

    } catch (error) {
        console.error("Reset Admin Password Error:", error);
        res.status(500).json({ message: 'Password reset failed', error });
    }
}

