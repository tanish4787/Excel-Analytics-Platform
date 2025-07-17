import User from '../Models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    console.log("[AuthController] Register attempt. Body:", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user', 
        });

        const token = jwt.sign(
            { _id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("[AuthController] Registration server error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};


export const loginUser = async (req, res) => {
    console.log("[AuthController] Login attempt received. Request Body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("[AuthController] Login failed: Email or password missing.");
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`[AuthController] Login failed: User with email ${email} not found.`);
            return res.status(400).json({ message: 'Invalid credentials.' }); 
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`[AuthController] Login failed: Password mismatch for user ${email}.`);
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log("[AuthController] Login successful. Setting cookie.");
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("[AuthController] Login server error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

export const logoutUser = (req, res) => {
    console.log("[AuthController] Logout attempt.");
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        expires: new Date(0), // Expire the cookie immediately
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};