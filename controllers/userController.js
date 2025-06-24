const db = require('../config/database');
// const auth = require('../auth');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserController {

    static async generateTokens(user) {
        console.log(user);

        const payload = {
            username: user.username,
            email: user.email
        }

        const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '60s' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        return { accessToken, refreshToken };
    }

    static async signUp(req, res) {
        try {
            const { fullName, userName, email, password, dob, role } = req.body;

            console.log(req.body);

            const existQuery = 'SELECT * FROM systemuser WHERE username = $1 OR email = $2';

            const result = await db.query(existQuery, [userName, email]);
            const rows = result.rows;

            if (rows.length) {
                console.log('User already exists:', { userName, email });
                return res.status(409).json('User already exists!');
            }

            console.log('User does not exist, creating new user:', { userName, email });

            await UserModel.createUser({ fullName, userName, email, password, dob, role, res });

            // Generate tokens for newly created user
            const userObj = {
                username: userName,
                email: email,
                role: role || 'USER'
            };

            const { accessToken, refreshToken } = await this.generateTokens(userObj);

            // Create expiry dates for tokens
            const refreshExpiry = new Date();
            refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days

            const accessExpiry = new Date();
            accessExpiry.setMinutes(accessExpiry.getMinutes() + 15); // 15 minutes

            // Store both tokens in database
            await UserModel.addRefreshToken(refreshToken, userName, refreshExpiry);
            await UserModel.addAccessToken(accessToken, userName, accessExpiry);

            return res.status(200).json({
                message: 'Success',
                accessToken,
                refreshToken,
                user: {
                    username: userName,
                    fullName: fullName,
                    role: role || 'USER'
                }
            });
        }

        catch (error) {
            console.error('Error in signup process:', error);
            return res.status(500).json(error);
        }
    }


    static async signIn(req, res) {
        try {
            console.log('SignIn Request Body:', req.body);
            
            const { username, password } = req.body;

            console.log('SignIn Credentials:', username, " ", password);

            const user = await UserModel.getUserWithPasswordByUsername(username);
            if (!user) return res.status(404).json('User not found');

            const isPasswordCorrect = bcrypt.compareSync(password, user.password || user.PASSWORD);
            if (!isPasswordCorrect) return res.status(400).json('Wrong credentials'); const { accessToken, refreshToken } = await this.generateTokens(user);

            // Create expiry dates for tokens
            const refreshExpiry = new Date();
            refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days

            const accessExpiry = new Date();
            accessExpiry.setMinutes(accessExpiry.getMinutes() + 15); // 15 minutes

            // Store both tokens in database
            await UserModel.addRefreshToken(
                refreshToken,
                user.username || user.USERNAME,
                refreshExpiry
            );

            await UserModel.addAccessToken(
                accessToken,
                user.username || user.USERNAME,
                accessExpiry
            );

            console.log('Tokens generated successfully:', { accessToken, refreshToken }); 

            res.json({
                accessToken,
                refreshToken,
                user: {
                    username: user.username || user.USERNAME,
                    fullName: user.fullname || user.FULLNAME,
                    role: user.role || user.ROLE
                }
            });
            console.log('Signin successful:', { username });
        }

        catch (error) {
            console.error('Error in signin process:', error);
            return res.status(500).json(error);
        }
    }


    static async logout(req, res) {
        try {
            const username = req.username;
            await UserModel.clearRefreshTokensForUser(username);

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });

        }
        
        catch (error) {
            console.error('Logout error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Controller to update user information
    static async updateUser(req, res) {
        try {
            const username = req.user.username;
            const { fullname, DOB, password } = req.body;

            await UserModel.updateUser(username, { fullName: fullname, DOB, password });

            // Fetch updated user
            const userResult = await UserModel.getUserByUsername(username);

            if (!userResult.success) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'User updated successfully',
                user: {
                    username: userResult.user.username,
                    fullname: userResult.user.fullname
                }
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    
    static async getUser(req, res) {
        try {
            const username = req.params.username;
            console.log('User Data Request for ', username);

            const userResult = await UserModel.getUserByUsername(username);

            if (!userResult.success) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = userResult.user;
            console.log('User data found:', user);

            return res.status(200).json({
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                dateofbirth: user.dateofbirth
            });
        }
        catch (error) {
            console.error('Error in getUser:', error);
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ message: 'No refresh token provided' });
            }

            // Check token in DB
            const tokenRecord = await UserModel.getUserByRefreshToken(refreshToken);
            if (!tokenRecord) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }

            // Optionally revoke old token
            await UserModel.updateRefreshToken(refreshToken);

            // Get user info and generate new tokens
            const userResult = await UserModel.getUserByUsername(tokenRecord.user_id);
            if (!userResult.success) {
                return res.status(404).json({ message: 'User not found' });
            }
            const user = userResult.user; const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user);

            // Create expiry dates for tokens
            const refreshExpiry = new Date();
            refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days

            const accessExpiry = new Date();
            accessExpiry.setMinutes(accessExpiry.getMinutes() + 15); // 15 minutes

            // Save both tokens in database
            await UserModel.addRefreshToken(newRefreshToken, tokenRecord.user_id, refreshExpiry);
            await UserModel.addAccessToken(accessToken, tokenRecord.user_id, accessExpiry);

            res.json({ accessToken, refreshToken: newRefreshToken });
        }
        
        catch (error) {
            console.error('Error in refreshToken process:', error);
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

module.exports = UserController;