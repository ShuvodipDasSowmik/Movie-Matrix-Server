const db = require('../config/database');

class blogModel {
    static async createBlog(blogData) {
        const { username, content, createdate, image } = blogData;

        const blogEntryQuery = `INSERT INTO BLOG(username, content, image, createdate, updatedate) VALUES ($1, $2, $3, $4, $5)`;
        const blogEntryResult = await db.query(blogEntryQuery, [username, content, image, createdate, createdate]);

        await Promise.all(
            blogEntryResult.map(async (blog) => {
                const blogReactionQuery = `
                    SELECT
                        REACTIONTYPE,
                        COUNT(*)
                    FROM
                        BLOGREACTION
                    WHERE
                        BLOGID = $1
                    GROUP BY
                        REACTIONTYPE
                `;

                const reactionResult = await db.query(blogReactionQuery, [blog.blogid]);
                blog.reactions = reactionResult.rows;
            }
        ));

        return blogEntryResult;
    }

    static async getBlogByUsername(username) {
        const userBlogQuery = `SELECT blogid, content, image, updatedate FROM BLOG WHERE username = $1`;
        const userBlogResult = await db.query(userBlogQuery, [username]);

        return userBlogResult.rows;
    }

    static async getAllBlogs() {
        const blogsQuery = `SELECT blogid, username, content, image, updatedate FROM BLOG`;
        const blogsQResult = await db.query(blogsQuery);
        const blogsResult = blogsQResult.rows;

        await Promise.all(
            blogsResult.map(async (blog) => {
                const blogReactionQuery = `
                    SELECT
                        REACTIONTYPE,
                        COUNT(*)
                    FROM
                        BLOGREACTION
                    WHERE
                        BLOGID = $1
                    GROUP BY
                        REACTIONTYPE
                `;

                const reactionResult = await db.query(blogReactionQuery, [blog.blogid]);
                blog.reactions = reactionResult.rows;
            }
        ));

        return blogsResult;
    }

    static async deleteBlog(blogid){
        const deleteQuery = `DELETE FROM BLOG WHERE BLOGID = $1`;

        await db.query(deleteQuery, [blogid]);
    }

    static async updateBlog(newData){
        const {blogid, content, updatedate, image} = newData;

        const updateBlogQuery =`
            UPDATE BLOG
            SET content = $1,
                updatedate = $2,
                image = $3
            WHERE blogid = $4
        `;

        const updateBlogResutl = await db.query(updateBlogQuery, [content, updatedate, image, blogid]);
    }
}

module.exports = blogModel;