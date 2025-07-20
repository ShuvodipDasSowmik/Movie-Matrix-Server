const db = require('../config/database');

class blogModel {
    static async createBlog(blogData) {
        const { username, content, createdate, image } = blogData;

        const blogEntryQuery = `INSERT INTO BLOG(username, content, image, createdate, updatedate) VALUES ($1, $2, $3, $4, $5)`;
        const blogEntryResult = await db.query(blogEntryQuery, [username, content, image, createdate, createdate]);


        return blogEntryResult;
    }

    static async getBlogByUsername(username) {
        const userBlogQuery = `SELECT blogid, content, image, updatedate FROM BLOG WHERE username = $1`;
        const userBlogResult = await db.query(userBlogQuery, [username]);

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

        await Promise.all(
            userBlogResult.rows.map(async (blog) => {
                const reactionResult = await db.query(blogReactionQuery, [blog.blogid]);
                const blogComments = await this.getCommentsByBlogId(blog.blogid);

                const reactorQuery = `
                    SELECT
                        username,
                        reactiontype
                    FROM
                        BLOGREACTION
                    WHERE
                        BLOGID = $1
                `;

                const reactorResult = await db.query(reactorQuery, [blog.blogid]);
                blog.reactors = reactorResult.rows;

                // console.log('reactorResult', reactorResult.rows);
                

                blog.comments = blogComments;
                blog.reactions = reactionResult.rows;
            }
        ));

        // console.log(userBlogResult.rows);

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
                const blogComments = await this.getCommentsByBlogId(blog.blogid);

                const reactorQuery = `
                    SELECT
                        username,
                        reactiontype
                    FROM
                        BLOGREACTION
                    WHERE
                        BLOGID = $1
                `;

                const reactorResult = await db.query(reactorQuery, [blog.blogid]);
                blog.reactors = reactorResult.rows;    
                
                
                blog.comments = blogComments;
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

    static async addCommentInBlog(commentData){
        const {blogid, username, commenttext, commentdate} = commentData;

        // console.log(blogid, username, commenttext, commentdate);
        

        const commentQuery = `
            INSERT INTO BLOGCOMMENT (blogid, username, commenttext, commentdate) values ($1, $2, $3, $4);
        `;

        await db.query(commentQuery, [blogid, username, commenttext, commentdate]);
    }

    static async deleteComment(commentid){
        const deleteCommentQuery = `
            DELETE FROM BLOGCOMMENT WHERE BLOGCOMMENTID = $1
        `;

        await db.query(deleteCommentQuery, [commentid]);
    }

    static async updateComment(commentid, commenttext){
        const updateCommentQuery = `
            UPDATE BLOGCOMMENT
            SET commenttext = $1
            WHERE blogcommentid = $2
        `;

        await db.query(updateCommentQuery, [commenttext, commentid]);
    }

    static async getCommentsByBlogId(blogid) {
        const commentsQuery = `
            SELECT blogcommentid, username, commenttext, commentdate
            FROM BLOGCOMMENT
            WHERE blogid = $1
        `;

        const commentsResult = await db.query(commentsQuery, [blogid]);
        return commentsResult.rows;
    }

    static async setReaction(blogid, username, reactionType) {
        const reactionQuery = `
            INSERT INTO BLOGREACTION (blogid, username, reactiontype)
            VALUES ($1, $2, $3)
            ON CONFLICT (blogid, username) DO UPDATE
            SET reactiontype = EXCLUDED.reactiontype
        `;

        await db.query(reactionQuery, [blogid, username, reactionType]);
    }

    static async removeReaction(blogid, username) {
        const removeReactionQuery = `
            DELETE FROM BLOGREACTION
            WHERE blogid = $1 AND username = $2
        `;

        await db.query(removeReactionQuery, [blogid, username]);
    }
}

module.exports = blogModel;