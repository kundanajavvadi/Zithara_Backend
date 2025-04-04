import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: API for user management
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               resume:
 *                 type: string
 *               resumeOriginalName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, bio, skills, resume, resumeOriginalName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        bio,
        skills,
        resume,
        resumeOriginalName,
      },
    });

    await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user and generate a JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in' });
  }
};

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */
export const logout = (req, res) => {
  try {
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging out' });
  }
};

/**
 * @swagger
 * /user/update-profile/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               resume:
 *                 type: string
 *               resumeOriginalName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Unauthorized (Invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    
    if (!token) {
      return res.status(400).json({ message: 'Authorization token is required' });
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decodedToken.userId;

    // If the token is invalid or expired, respond with an error
    if (!userIdFromToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const { userId } = req.params;

    // Ensure the user ID in the URL matches the one in the token
    if (userIdFromToken !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this profile' });
    }

    const { bio, skills, resume, resumeOriginalName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile fields
    user.profile.bio = bio || user.profile.bio;
    user.profile.skills = skills || user.profile.skills;
    user.profile.resume = resume || user.profile.resume;
    user.profile.resumeOriginalName = resumeOriginalName || user.profile.resumeOriginalName;

    // Save the updated user profile
    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: user.profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};
