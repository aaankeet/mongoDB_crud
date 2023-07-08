const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password)
		return res
			.status(400)
			.json({ message: `username & password are required` }); // Bad Request

	// check for duplicate usernames in the db
	const duplicate = await User.findOne({ username: username }).exec();
	if (duplicate)
		return res.status(409).json({ message: `${username} already exist` }); // Conflict

	// Create and store the new user
	try {
		// Encrypt the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Store the new user
		const result = await User.create({
			username: username,
			password: hashedPassword,
		});

		console.log(result);

		res.status(201).json({
			message: `User ${username} created successfully`,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { handleNewUser };
