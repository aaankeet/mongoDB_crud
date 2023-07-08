require('dotenv').config;
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT | 3500;
const corsOptions = require('./config/corsOptions');
const { eventLogger, logEvents } = require('./middleware/logEvents.js');
const errorLogger = require('./middleware/errorLogger.js');
const verifyJWT = require('./middleware/verify');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

// connect to MongoDB
connectDB();

// custom middleware logger
app.use(eventLogger);

// Cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
	res.status(404);

	const contentType = req.accepts('html', 'json');

	if (contentType === 'html') {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (contentType === 'json') {
		res.json({ error: '404 Not Found!' });
	} else {
		res.type('txt').send('404 Not Found!');
	}
});

// Error Handler
app.use(errorLogger);

// start server
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
