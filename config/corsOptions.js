const whiteListedDomains = [
	// 'https://www.google.com',
	'http:127.0.0.1:5500',
	'http://localhost:3000',
];

const corsOptions = {
	origin: (origin, callback) => {
		if (whiteListedDomains.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionSuccessStatus: 200,
};

module.exports = corsOptions;
