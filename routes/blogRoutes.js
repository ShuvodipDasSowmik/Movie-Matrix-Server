const router = require('express').Router();
const BlogController = require('../controllers/blogController');
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/create-blog', verifyToken, upload.single('image'), BlogController.CreatePost);
router.get('/posts/:username', verifyToken, BlogController.GetPostByUsername);

module.exports = router;