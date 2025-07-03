const db = require('../config/database');

class blogModel{
    static async createBlog(blogData){
        const {username, content, createdate, image } = blogData;

        const blogEntryQuery = `INSERT INTO BLOG(username, content, image, createdate, updatedate) VALUES ($1, $2, $3, $4, $5)`;

        const blogEntryResult = await db.query(blogEntryQuery, [username, content, image, createdate, createdate]);

        return blogEntryResult;
    }

    static async getBlogByUsername(username){
        const userBlogQuery = `SELECT blogid, content, image, updatedate FROM BLOG WHERE username = $1`;
        const userBlogResult = await db.query(userBlogQuery, [username]);

        return userBlogResult.rows;
    }
}

module.exports = blogModel;