
const googleVoterModel = require('../models/googleVoterModel.js');

const listVoters = async (req, res) => {
    try {
        // Fetch all voters from the database
        const voters = await googleVoterModel.find({});

        if (voters.length === 0) {
            return res.status(404).json({ message: 'No voters found' });
        }

        res.status(200).json(voters);
    } catch (error) {
        console.error('Error fetching voters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    listVoters
};