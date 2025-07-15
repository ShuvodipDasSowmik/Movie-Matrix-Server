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
    } catch (error) {
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
    } catch (error) {
        console.error('Error fetching admin statistics:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};