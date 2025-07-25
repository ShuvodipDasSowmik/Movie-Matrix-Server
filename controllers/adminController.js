const AdminModel = require('../models/adminModel');

// Handles POST /admin
exports.handleAdminEntry = async (req, res) => {
    const reqData = req.body;
    try {
        console.log('Received admin entry request:', reqData);

        switch (reqData.dataType) {
            case 'genre':
                return await AdminModel.insertGenres(reqData.data, res);
            case 'studio':
                return await AdminModel.insertStudios(reqData.data, res);
            case 'actor':
                return await AdminModel.insertActors(reqData.data, res);
            case 'director':
                return await AdminModel.insertDirectors(reqData.data, res);
            case 'media':
                return await AdminModel.insertMedia(reqData.data, res);
            case 'mediaactor':
                return await AdminModel.insertMediaActors(reqData.data, res);
            case 'mediadirector':
                return await AdminModel.insertMediaDirectors(reqData.data, res);
            case 'mediastudio':
                return await AdminModel.insertMediaStudios(reqData.data, res);
            case 'mediagenre':
                return await AdminModel.insertMediaGenres(reqData.data, res);
            default:
                return res.status(400).json({ message: 'Invalid dataType' });
        }
    }
    
    catch (error) {
        console.error('Error processing admin entry:', error);
        return res.status(500).json('Internal server error');
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const statResult = await AdminModel.getAdminStats();
        console.log(statResult);
        
        return res.status(200).json({
            message: 'Success',
            statResult
        });

    }
    
    catch (error) {
        console.error('Error fetching admin statistics:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.sendEmail = async (req, res) => {
    const {users, message, subject} = req.body;

    try {
        console.log('Sending email to users:', users);
        console.log('Message:', message);

        const reponse = await AdminModel.sendEmail(users, subject, message);

        return res.status(200).json({
            message: 'Emails sent successfully',
            users
        });
    } 
    
    catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


exports.getUserLocationInfo = async (req, res) => {
    try {
        const userLocationInfo = await AdminModel.getUserLocationInfo();
        // console.log('User Location Info:', userLocationInfo);

        return res.status(200).json({
            message: 'Success',
            userLocationInfo
        });
    } 
    
    catch (error) {
        console.error('Error fetching user location info:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};