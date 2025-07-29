const db = require('../config/database')
const bcrypt = require('bcryptjs')

class User {

    static async getAllUser(){
        try {
            const query = `SELECT * FROM SYSTEMUSER`;
            const result = await db.query(query);
            return result.rows;
        } 
        
        catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            const { fullName, userName, email, password, dob, role } = userData;

            const salt = bcrypt.genSaltSync(10);
            const hashed = bcrypt.hashSync(password, salt);

            const createUserQuery = `INSERT INTO SYSTEMUSER (FULLNAME, USERNAME, EMAIL, PASSWORD, ROLE, DATEOFBIRTH) VALUES ($1, $2, $3, $4, $5, $6)`;

            const values = [fullName, userName, email, hashed, role, dob];

            const userQuery = `INSERT INTO USERS (USERNAME) VALUES ($1)`;

            await db.query(createUserQuery, values);
            await db.query(userQuery, [userName]);

            console.log(`User ${userName} Successfully Created !`);

            return { success: true, message: 'User Created Successfully' };
        }

        catch (error) {
            console.error(`Error Creating User: `, error.message);
            throw new Error(error.message);
        }
    }

    static async getUserByUsername(username) {
        try {
            const usernameQuery = `SELECT USERNAME, FULLNAME, EMAIL, DATEOFBIRTH, ROLE FROM SYSTEMUSER WHERE USERNAME = $1`;

            const result = await db.query(usernameQuery, [username]);

            if (result.rows.length === 0) {
                return { success: false, message: 'User not found' };
            }

            return { success: true, user: result.rows[0] };
        }

        catch (error) {
            console.error(`Error getting User, `, username);
            throw new Error(error.message);
        }
    }

    static async getUserByEmail(email) {
        try {
            const usernameQuery = `SELECT USERNAME, FULLNAME, EMAIL, DATEOFBIRTH, ROLE FROM SYSTEMUSER WHERE EMAIL = $1`;

            const result = await db.query(usernameQuery, [email]);

            if (result.rows.length === 0) {
                return { success: false, message: 'User not found' };
            }

            return { success: true, user: result.rows[0] };
        }

        catch (error) {
            console.error(`Error getting User, `, username);
            throw new Error(error.message);
        }
    }

    static async getUserByRefreshToken(refreshToken) {
        try {
            const query = `SELECT user_id FROM refresh_token WHERE token = $1 AND expiry > NOW() AND revoked = FALSE`;

            const result = await db.query(query, [refreshToken]);
            
            return result.rows[0];
        }

        catch (error) {
            console.error('Error getting refresh token:', error.message);
            throw new Error(error.message);
        }
    }

    static async updateRefreshToken(token) {
        try {
            const query = `UPDATE refresh_token SET revoked = TRUE WHERE token = $1`;
            await db.query(query, [token]);
        }

        catch (error) {
            console.error('Error updating refresh token:', error.message);
            throw new Error(error.message);
        }
    }

    static async clearRefreshTokensForUser(username) {
        try {
            const query = `UPDATE refresh_token SET revoked = TRUE WHERE user_id = $1`;
            await db.query(query, [username]);
        }

        catch (error) {
            console.error('Error clearing refresh tokens for user:', error.message);
            throw new Error(error.message);
        }
    }
    
    static async updateUser(username, updateData) {
        try {
            const { fullName, DOB, password } = updateData;

            let hashedPass;
            if (password) {
                const salt = bcrypt.genSaltSync(10);
                hashedPass = bcrypt.hashSync(password, salt);
            }

            const updateQuery = `
            UPDATE SYSTEMUSER
            SET FULLNAME = COALESCE($2, FULLNAME),
                DATEOFBIRTH = COALESCE ($3, DATEOFBIRTH),
                PASSWORD = COALESCE ($4, PASSWORD)
            WHERE
                USERNAME = $1
        `;

            await db.query(updateQuery, [username, fullName, DOB, hashedPass]);
        }

        catch (error) {
            console.error('Error Updating User Data, ', error.message);
            throw new Error(error.message);
        }
    }

    static async getUserWithPasswordByUsername(username) {
        try {
            const query = `SELECT * FROM systemuser WHERE username = $1`;
            const result = await db.query(query, [username]);

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0];
        } 
        
        catch (error) {
            console.error('Error getting user with password:', error.message);
            throw new Error(error.message);
        }
    }

    static async addRefreshToken(token, userId, expiry) {
        try {
            const query = `INSERT INTO refresh_token (token, user_id, expiry) VALUES ($1, $2, $3)`;
            await db.query(query, [token, userId, expiry]);
        }
        
        catch (error) {
            console.error('Error adding refresh token:', error.message);
            throw new Error(error.message);
        }
    }

    static async addAccessToken(token, userId, expiry) {
        try {
            const query = `INSERT INTO access_token (token, user_id, expiry) VALUES ($1, $2, $3)`;
            await db.query(query, [token, userId, expiry]);
        } catch (error) {
            console.error('Error adding access token:', error.message);
            throw new Error(error.message);
        }
    }

    static async validateAccessToken(token, username) {
        try {
            const query = `SELECT * FROM access_token WHERE token = $1 AND user_id = $2 AND expiry > NOW() AND revoked = FALSE`;
            const result = await db.query(query, [token, username]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error validating access token:', error.message);
            throw new Error(error.message);
        }
    }

    static async revokeAccessToken(token) {
        try {
            const query = `UPDATE access_token SET revoked = TRUE WHERE token = $1`;
            await db.query(query, [token]);
        } catch (error) {
            console.error('Error revoking access token:', error.message);
            throw new Error(error.message);
        }
    }

    static async clearAccessTokensForUser(userId) {
        try {
            const query = `UPDATE access_token SET revoked = TRUE WHERE user_id = $1`;
            await db.query(query, [userId]);
        } catch (error) {
            console.error('Error clearing access tokens for user:', error.message);
            throw new Error(error.message);
        }
    }
}

module.exports = User;

// Num of Queries = 15 [Simple = 15]