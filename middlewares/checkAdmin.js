const db = require('../config/database');

const checkAdmin = async (req, res, next) => {
    try {
        const username = req.user?.username;
        if (!username) {
            console.error('No username found in request');
            return res.status(401).json({ success: false, message: 'Unauthorized: No username found' });
        }

        const query = `SELECT role FROM SYSTEMUSER WHERE username = $1`;
        const result = await db.query(query, [username]);

        if (result.rows.length === 0) {
            console.error('User not found:', username);
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (result.rows[0].role !== 'ADMIN') {
            console.error('Access denied for user:', username);
            return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
        }

        // User is an admin, proceed to the next middleware or route handler
        // console.log('Admin check passed for user:', username);

        next();
    }
    
    catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = checkAdmin;
