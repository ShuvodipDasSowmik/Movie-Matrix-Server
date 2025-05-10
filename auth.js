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

    const q = 'INSERT INTO SYSTEM_USERS (`FULLNAME`, `USERNAME`, `EMAIL`, `PASSWORD`, `ROLE`) VALUES (?)';
    const values = [fullName, userName, email, hashed, role];


    console.log('Inserting user into database:', DOB);

    const q2 = 'INSERT INTO USERS (`USERNAME`, `DOB`) VALUES (?, ?)';

    const [result] = await db.query(q, [values]);
    const [result2] = await db.query(q2, [userName, DOB]);

    console.log('User created successfully:', result && result2);

    return res.status(201).json('User created!');

  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json(error);
  }
}


// db.query(query, values)
// sqlQuery: SQL query string with placeholders (e.g., '?')
// values: Array of values to replace the placeholders in the SQL query
// callback: Function to handle the result of the query (error, data)
// Example: db.query('SELECT * FROM users WHERE id = ?', [userId], (err, data) => { ... })

router.post('/signup', async (req, res) => {
  try {
    const { fullName, userName, email, password, dob, role } = req.body;

    console.log('Received signup request:', req.body);

    // Check if the user already exists
    const existQuery = 'SELECT * FROM SYSTEM_USERS WHERE username = ? OR email = ?';

    const [rows] = await db.query(existQuery, [userName, email]);
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

    const q = 'SELECT * FROM SYSTEM_USERS WHERE username = ?';

    const [rows] = await db.query(q, [userName]);

    if (rows.length === 0) return res.status(404).json('User not found');

    
    const isPasswordCorrect = bcrypt.compareSync(password, rows[0].PASSWORD);
    if (!isPasswordCorrect) return res.status(400).json('Wrong credentials');

    // Generate a JWT token
    const token = jwt.sign({ id: rows[0].id }, process.env.TOKEN_SECRET);

    res.json({ token, user: { username: rows[0].USERNAME } });
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

module.exports = router;