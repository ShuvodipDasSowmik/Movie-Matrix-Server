const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;

    console.log('Request for Refresh Token Receieved');
    

    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired refresh token' });

    const user = {
        username: payload.username,
        email: payload.email,
        
    };

    const newAccessToken = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken, user });
});

});


module.exports = router;
