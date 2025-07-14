const adminModel = require('./adminModel');

// Handles POST /admin
exports.handleAdminEntry = async (req, res) => {
    const reqData = req.body;
    try {
        console.log('Received admin entry request:', reqData);

        switch (reqData.dataType) {
            case 'genre':
                return await adminModel.insertGenres(reqData.data, res);
            case 'studio':
                return await adminModel.insertStudios(reqData.data, res);
            case 'actor':
                return await adminModel.insertActors(reqData.data, res);
            case 'director':
                return await adminModel.insertDirectors(reqData.data, res);
            case 'media':
                return await adminModel.insertMedia(reqData.data, res);
            case 'mediaactor':
                return await adminModel.insertMediaActors(reqData.data, res);
            case 'mediadirector':
                return await adminModel.insertMediaDirectors(reqData.data, res);
            case 'mediastudio':
                return await adminModel.insertMediaStudios(reqData.data, res);
            case 'mediagenre':
                return await adminModel.insertMediaGenres(reqData.data, res);
            default:
                return res.status(400).json({ message: 'Invalid dataType' });
        }
    } catch (error) {
        console.error('Error processing admin entry:', error);
        return res.status(500).json('Internal server error');
    }
};