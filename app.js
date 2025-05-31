require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


app.use(express.json());    // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));    // Parse URL-encoded bodies
app.use(cors());


const authRoutes = require('./auth');
app.use('/', authRoutes);

const adminEntryRoutes = require('./adminEntry');
app.use('/', adminEntryRoutes);

const userDashboardRoutes = require('./userDashboard');
app.use('/', userDashboardRoutes);

const actor = require('./actorDashboard');
app.use('/', actor)

app.get('/', (req, res) => {
    res.send('MovieMatrix Server is running');
});

module.exports = app;