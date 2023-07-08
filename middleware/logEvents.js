const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const fsPromises = require('fs').promises;

const logEvents = async (message, logFileName) => {
	const dataTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
	const logItem = `${dataTime}\t${uuid()}\t${message}\n`;

	console.log(logItem);

	try {
		// Create Log Dir
		if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
		}
		// append files
		await fsPromises.appendFile(
			path.join(__dirname, '..', 'logs', logFileName),
			logItem
		);
	} catch (err) {
		console.log(err);
	}
};

const eventLogger = (req, res, next) => {
	logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
	next();
};

module.exports = { eventLogger, logEvents };
