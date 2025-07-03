const BlogModel = require('../models/blogModel');
const cloudUpload = require('../utility/cloudUpload');


class BlogController {
    static async CreatePost(req, res) {
        try {
            let imageBuffer, imageName, image;

            if(req.file?.buffer){
                imageBuffer = req.file.buffer;
                imageName = req.file.originalname;
                image = await cloudUpload(imageBuffer, imageName);
            }

            const blogData = {
                username: req.body.username,
                content: req.body.content,
                createdate: req.body.createdate
            }

            if(image){
                blogData.image = image;
            }

            const uploadPost = await BlogModel.createBlog(blogData);

            if(!uploadPost){
                throw Error("Error Creating The Post")
            }
            else{
                console.log("Post Uploaded Successfully");
                
            }

            return res.status(200).json({
                message: 'Success'
            })
        }

        catch (error) {
            console.error(error.message);
            
            return res.status(500).json({
                message: error.message
            })
        }
    }

    static async GetPostByUsername(req, res){
        try {
            const username = req.params.username;

            const userBlogData = await BlogModel.getBlogByUsername(username);

            console.log(userBlogData);
            
            return res.status(200).json({
                message: 'Success',
                userBlogData
            })
        }
        catch (error) {
            console.error(error.message);
            
            return res.status(200).json({
                message: error.message
            })
        }
    }
}

module.exports = BlogController;