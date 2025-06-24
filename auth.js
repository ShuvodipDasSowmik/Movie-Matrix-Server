// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('./models/userModel');

// // Middleware to verify JWT token
// const verifyToken = require('./middlewares/verifyToken');

// // Protected route that requires authentication
// router.get('/protected', verifyToken, (req, res) => {
//     res.json({
//         message: 'This is a protected route',
//         user: req.user
//     });
// });

// // Helper function to generate JWT tokens
// const generateTokens = async (user) => {
//     const payload = {
//         username: user.username || user.USERNAME,
//         email: user.email || user.EMAIL,
//         role: user.role || user.ROLE
//     };

//     const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '15m' });
//     const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

//     return { accessToken, refreshToken };
// };

// // router.post('/refresh-token', async (req, res) => {
// //   const { refreshToken } = req.body;
// //   if (!refreshToken) {
// //     return res.status(400).json({ message: 'Refresh token is required' });
// //   }
// //   try {
// //     // Use userModel to get refresh token
// //     const tokenData = await User.getUserByRefreshToken(refreshToken);
// //     if (!tokenData) {
// //       return res.status(401).json({ message: 'Invalid or expired refresh token' });
// //     }
// //     // Get user data
// //     const userResult = await db.query(
// //       'SELECT username, role FROM systemuser WHERE username = $1',
// //       [tokenData.user_id]
// //     );
// //     if (userResult.rows.length === 0) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }
// //     const user = userResult.rows[0];
// //     // Revoke current refresh token (token rotation for security)
// //     await User.updateRefreshToken(refreshToken);
// //     // Generate new tokens
// //     const newTokens = await generateTokens(user);
// //     return res.json({
// //       accessToken: newTokens.accessToken,
// //       refreshToken: newTokens.refreshToken,
// //       user: {
// //         username: user.username,
// //         role: user.role
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error refreshing token:', error);
// //     return res.status(500).json({ message: 'Server error', error: error.message });
// //   }
// // });

// // // Middleware to verify JWT token


// // // At the end of the file, change the export to:
// // const authRouter = router;
// module.exports = router;
