const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\nMovieMatrix Server is running on port ${PORT}\nPress Ctrl+C to stop the server`);
    console.log(`You can access the server at http://localhost:${PORT}\n`);
});