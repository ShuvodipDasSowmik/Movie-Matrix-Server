const router = require('express').Router();
const BlogController = require('../controllers/blogController');
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/create-blog', verifyToken, upload.single('image'), BlogController.CreatePost);
router.get('/posts/:username', verifyToken, BlogController.GetPostByUsername);
router.get('/posts', BlogController.getAllPosts);
router.delete('/delete/:blogid', verifyToken, BlogController.DeleteBlog);
router.put('/update/:blogid', verifyToken, BlogController.UpdateBlog);
router.post('/add-comment', verifyToken, BlogController.AddComment);
router.delete('/delete-comment/:commentid', verifyToken, BlogController.DeleteComment);
router.put('/update-comment/:commentid', verifyToken, BlogController.UpdateComment);
router.get('/comments/:blogid', BlogController.GetCommentsByBlogId);
router.post('/add-reaction', verifyToken, BlogController.SetReaction);
router.delete('/remove-reaction', verifyToken, BlogController.RemoveReaction);

module.exports = router;