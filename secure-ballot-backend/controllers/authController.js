const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Voter = require('../models/voterModel.js');


const addUser = async (req, res) => {
    const { name, email, password, publicKey } = req.body;

    try {
        // Check if user already exists
        const existingUser = await Voter.find({ email});

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);  

        // Create a new user
        const newUser = new Voter({
            name,
            email,
            passwordHash,
            publicKey
        });
        // Generate a JWT token
        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '6h' }
        );


        // Save the user to the database
        await newUser.save();   
        res.status(201).json({ message: 'Registration successfull' , token});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    addUser
}