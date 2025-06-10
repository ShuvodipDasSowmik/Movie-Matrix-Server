const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const router = express.Router();

const createUser = async (fullName, userName, email, password, DOB, role, res) => {
  try {
    console.log('Creating user:', { userName, email });

    // Salt - a random string added to the password before hashing
    const salt = bcrypt.genSaltSync(10);

    // Hash the password with the salt
    const hashed = bcrypt.hashSync(password, salt);

    // PostgreSQL uses $1, $2, etc. for parameter placeholders
    const q = 'INSERT INTO systemuser (FULLNAME, USERNAME, EMAIL, PASSWORD, ROLE, DATEOFBIRTH) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [fullName, userName, email, hashed, role, DOB];

    console.log('Inserting user into database:', DOB);

    const q2 = 'INSERT INTO USERS (USERNAME) VALUES ($1)';

    // Execute the queries and handle the results
    const result = await db.query(q, values);
    const result2 = await db.query(q2, [userName]);

    console.log('User created successfully:', result && result2);

    return res.status(201).json('User created!');

  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json(error);
  }
}

// PostgreSQL uses $1, $2, etc. for parameter placeholders instead of ?
// Example: db.query('SELECT * FROM users WHERE id = $1', [userId])

router.post('/signup', async (req, res) => {
  try {
    const { fullName, userName, email, password, dob, role } = req.body;

    console.log('Received signup request:', req.body);

    // Check if the user already exists
    const existQuery = 'SELECT * FROM systemuser WHERE username = $1 OR email = $2';

    const result = await db.query(existQuery, [userName, email]);
    const rows = result.rows; // PostgreSQL returns result.rows instead of [rows]
    console.log('Checking user existence:', { userName, email, found: rows.length > 0 });

    if (rows.length) {
      console.log('User already exists:', { userName, email });
      return res.status(409).json('User already exists!');
    }

    console.log('User does not exist, creating new user:', { userName, email });

    await createUser(fullName, userName, email, password, dob, role, res);

  } catch (error) {
    console.error('Error in signup process:', error);
    return res.status(500).json(error);
  }
});

// User Authentication Route

router.post('/signin', async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log('Received signin request:', req.body);

    const q = 'SELECT * FROM systemuser WHERE username = $1';

    const result = await db.query(q, [userName]);
    const rows = result.rows;

    if (rows.length === 0) return res.status(404).json('User not found');

    // PostgreSQL column names might be case-sensitive or lowercase by default
    const isPasswordCorrect = bcrypt.compareSync(password, rows[0].password || rows[0].PASSWORD);
    if (!isPasswordCorrect) return res.status(400).json('Wrong credentials');

    // Generate a JWT token with more user information
    const token = jwt.sign({ 
      id: rows[0].id,
      username: rows[0].username || rows[0].USERNAME,
      role: rows[0].role || rows[0].ROLE
    }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      user: { 
        username: rows[0].username || rows[0].USERNAME,
        fullName: rows[0].fullname || rows[0].FULLNAME,
        role: rows[0].role || rows[0].ROLE
      } 
    });
    console.log('Signin successful:', { userName });

  } catch (error) {
    console.error('Error in signin process:', error);
    return res.status(500).json(error);
  }
});



// Middleware to verify JWT token

const verifyToken = (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json('Not authenticated!');

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json('Token is not valid!');
    req.user = user;
    next();
  });

}

// At the end of the file, change the export to:
const authRouter = router;
module.exports = authRouter;

// Export verifyToken separately
module.exports.verifyToken = verifyToken;