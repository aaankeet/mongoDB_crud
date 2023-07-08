const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleLogin = async (req, res) => {
	const { username, password } = req.body;

	// Bad Request
	if (!username || !password)
		return res
			.status(400)
			.json({ message: `Username and password are required` });

	const foundUser = await User.findOne({ username: username }).exec();
	if (!foundUser) return res.sendStatus(401); // Unauthorized

	// Evaluate
	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		const roles = Object.values(foundUser.roles);
		// Create JWT
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.firstName,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '5min' }
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.firstName },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		// Saving refreshToken with current use
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		console.log(result);

		// Send JWT
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.json({ accessToken });
	} else {
		// Unauthorized
		return res.sendStatus(401);
	}
};

module.exports = { handleLogin };
