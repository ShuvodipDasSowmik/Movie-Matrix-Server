const express = require('express');
const db = require('./database');
const auth = require('./auth');
const verifyToken = auth.verifyToken;
const router = express.Router();

// Route to validate token and get user info
router.get('/validate-token', verifyToken, async (req, res) => {
  try {
    // Get username from the decoded token
    const tokenUsername = req.user.username;
    // Get requested username from query params
    const requestedUsername = req.query.requestedUsername;
    
    // If a specific profile is requested, check authorization
    if (requestedUsername && tokenUsername !== requestedUsername) {
      // Check if user has permissions to view the requested profile
      // For example, admin users might be allowed to view any profile
      const isAdmin = req.user.role === 'ADMIN';
      
      if (!isAdmin) {
        return res.status(403).json({ 
          message: 'You do not have permission to view this profile',
          authorizedUsername: tokenUsername 
        });
      }
    }
    
    // Use the requested username if provided and authorized, otherwise use the token username
    const username = requestedUsername || tokenUsername;
    
    // Fetch user information from database
    const query = 'SELECT username, fullname, email, dateofbirth, role FROM systemuser WHERE username = $1';
    const result = await db.query(query, [username]);    
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = result.rows[0];
    console.log('User information:', user);
    
    // Return user information (excluding sensitive data like password)
    return res.status(200).json({
      valid: true,
      user: {
        username: user.username,
        fullName: user.fullname,
        email: user.email,
        role: user.role,
        dateofbirth: user.dateofbirth
      }
    });
  } catch (error) {
    console.error('Error validating token:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get user dashboard data
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // You can add more dashboard specific data here
    // For example: user watchlist, recommendations, etc.
    
    // Placeholder for dashboard data
    return res.status(200).json({
      message: 'Dashboard data fetched successfully',
      // Add more data as needed
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to update user information
router.put('/update-user', verifyToken, async (req, res) => {
  try {
    const username = req.user.username;
    const { fullName } = req.body;
    
    // Update user information
    const query = 'UPDATE systemuser SET fullname = $1 WHERE username = $2 RETURNING *';
    const result = await db.query(query, [fullName, username]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ 
      message: 'User updated successfully', 
      user: {
        username: result.rows[0].username,
        fullName: result.rows[0].fullname
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;