const Employee = require('../model/Employee');

// Get Single Employee
const getEmployee = async (req, res) => {
	if (!req?.params?.id)
		return res.status(400).json({ message: 'Id is required' });

	// find employee
	const employee = await Employee.findOne({ _id: req.params.id }).exec();
	if (!employee)
		return res.status(204).json({ message: 'Employee not found' });

	console.log(employee);
	// if employee found return employee
	res.json(employee);
};

// Get All Employees
const getAllEmployees = async (req, res) => {
	const employees = await Employee.find();
	if (employees.length === 0)
		return res.status(204).json({ message: `There are no employees` });

	res.json(employees);
};

// Create New Employee
const createNewEmployee = async (req, res) => {
	if (!req?.body?.firstName || !req?.body?.lastName)
		return res
			.status(400)
			.json({ msg: 'First Name and Last Name are required' });
	try {
		const result = new Employee({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		});
		await result.save();
		res.status(201).json(result);
	} catch (err) {
		console.log(err);
	}
};

// Update Existing Employee
const updateEmployee = async (req, res) => {
	// Find Employee Id
	if (!req?.body?.id)
		return res.status(400).json({ message: 'Id is required' });

	const employee = await Employee.findOne({ _id: req.body.id }).exec();

	// If Employee Id not found return error.
	if (!employee)
		return res.status(204).json({ msg: `Employee Id not found` });

	if (req.body?.firstName) employee.firstName = req.body.firstName;
	if (req.body?.lastName) employee.lastName = req.body.lastName;

	const result = await employee.save();
	res.json(result);
};

// Delete Existing Employee
const deleteEmployee = async (req, res) => {
	if (!req?.body?.id)
		return res.status(400).json({ message: 'Id is required' });

	const employee = await Employee.findOne({ _id: req.body.id }).exec();

	// If Employee Id not found return error.
	if (!employee)
		return res.status(204).json({ message: `Employee Id  not found` });
	console.log(employee);
	// If Employee Id found, delete employee.
	const result = await employee.deleteOne({ _id: req.body.id });
	res.json(result);
};

module.exports = {
	getEmployee,
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
};
