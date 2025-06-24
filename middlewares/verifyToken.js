const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

        console.log('Authorization header:', authHeader);


        if (!token) {
            console.error('Access token is missing');
            return res.status(401).json({ message: 'Access token is required' });
        }


        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                console.error('Token verification error:', err);

                return res.status(401).json({
                    success: false,
                    message: 'Invalid or Expired Token'
                })
            }
            console.log('Token verified successfully:', user);

            req.user = user;
            next();
        })

    }

    catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = verifyToken;