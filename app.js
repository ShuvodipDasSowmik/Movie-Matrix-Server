require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


app.use(express.json({limit: '10mb'}));    // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));    // Parse URL-encoded bodies
app.use(cors());

app.set('trust proxy', true);

const refreshToken = require('./routes/refreshToken');
app.use('/', refreshToken);

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

const actorRoutes = require('./routes/actorRoutes');
app.use('/', actorRoutes);

const mediaRoutes = require('./routes/mediaRoutes');
app.use('/', mediaRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

const searchRoutes = require('./routes/searchRoutes');
app.use('/', searchRoutes);

const blogRoutes = require('./routes/blogRoutes');
app.use('/', blogRoutes);

const watchlist = require('./routes/watchlistRoutes');
app.use('/', watchlist);

const genre = require('./routes/genrePrefRoutes');
app.use('/', genre);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/', reviewRoutes);

app.get('/', (req, res) => {
    res.send('MovieMatrix Server is running');
});

module.exports = app;