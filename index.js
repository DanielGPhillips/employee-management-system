const inquirer = require('inquirer');
const CTable = require('console.table')
const mysql2 = require('mysql2');
const connection = require('./util/connection');
const db = connection;

let listOfDepartmentNames = [];
let departmentNamesToIds = {};
let listOfRoleTitles = [];
let roleTitlesToIds = {};
let listOfEmployeeNames = ["N/A"];
let employeeNamesToIds = {"N/A": null};

const buildNameArrays = () => {
    db.query("SELECT * FROM department_table", (err, data) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < data.length; i++) {
            listOfDepartmentNames.push(data[i].department_name);
            departmentNamesToIds[data[i].department_name] = data[i].id;
        }
    });
    db.query("SELECT * FROM role_table", (err, data) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < data.length; i++) {
            listOfRoleTitles.push(data[i].title);
            roleTitlesToIds[data[i].title] = data[i].id;
        }
    });
    db.query("SELECT * FROM employee_table", (err, data) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < data.length; i++) {
            listOfEmployeeNames.push(data[i].first_name + " " + data[i].last_name);
            employeeNamesToIds[data[i].first_name + " " + data[i].last_name] = data[i].id;
        }
    });
}




const mainMenuQuestions = [{
    type: "list",
    message: "What would you like to do?",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee's role", "Quit"],
    name: "mainMenuChoice"
}];

const departmentPrompt = [{
    type: "input",
    message: "Please enter the name of the department you would like to add to the database (maximum length: 30 characters): ",
    name: "newDepartment"
}];

const rolePrompt = [
    {
        type: "input",
        message: "Please enter the title of the role you would like to add to the database (Maximum length: 30 characters): ",
        name: "newRole"
    }, 
    {
        type: "input",
        message: "Please enter the salary of the role you would like to add to the database: ",
        name: "salary"
    }, 
    {
        type: "list",
        message: "To what department does this role belong?",
        choices: listOfDepartmentNames,
        name: "departmentName"
    }
];

const employeePrompt = [
    {
        type: "input",
        message: "Please enter the first name of this new employee (maximum length: 30 characters): ",
        name: "firstName"
    }, 
    {
        type: "input",
        message: "Please enter the last name of this new employee (maximum length: 30 characters): ",
        name: "lastName"
    },
    {
        type: "list",
        message: "What role will this employee be taking on?",
        choices: listOfRoleTitles,
        name: "roleTitle"
    }, 
    {
        type: "list",
        message: "What is the name of this employee's manager?",
        choices: listOfEmployeeNames,
        name: "managerName"
    }
];

const updateEmployeePrompt = [
    {
        type: "list",
        message: "What is the name of the employee whose role you wish to change?",
        choices: listOfEmployeeNames,
        name: "employeeName"
    },
    {
        type: "list",
        message: "What new role will this employee be taking on?",
        choices: listOfRoleTitles,
        name: "newRoleTitle"
    }
];

const viewAllDepartments = () => {
    db.query("SELECT department_name, id AS department_id FROM department_table", (err, data) => {
        if (err) {
            throw err;
        }
        console.table(data);
        runMain();
    });
}

const viewAllRoles = () => {
    db.query("SELECT role_table.title AS role_title, role_table.id AS role_id, department_table.department_name AS department, role_table.salary FROM role_table JOIN department_table ON role_table.department_id = department_table.id", (err, data) => {
        if (err) {
            throw err;
        }
        console.table(data);
        runMain();
    });
}

const viewAllEmployees = () => {
    db.query("SELECT employee_table.id AS employee_id, employee_table.first_name, employee_table.last_name, role_table.title AS role_title, department_table.department_name, role_table.salary, manager_table.first_name AS manager_first_name, manager_table.last_name AS manager_last_name FROM employee_table JOIN role_table ON employee_table.role_id = role_table.id LEFT JOIN department_table ON role_table.department_id = department_table.id LEFT JOIN employee_table AS manager_table ON employee_table.manager_id = manager_table.id",
    (err, data) => {
        if (err) {
            throw err;
        }
        console.table(data);
        runMain();
    });
}

const addDepartment = async () => {
    const { newDepartment } = await inquirer.prompt(departmentPrompt);

    db.query("INSERT INTO department_table (department_name) VALUES (?)", newDepartment, (err, data) => {
        if (err) {
            throw err;
        }
        listOfDepartmentNames.push(newDepartment);
        departmentNamesToIds[newDepartment] = data.insertId;
        console.log("\nAdded " + newDepartment + " to department_table\n");
        runMain();
    });
}

const addRole = async () => {
    const { newRole, salary, departmentName } = await inquirer.prompt(rolePrompt);
    const departmentId = departmentNamesToIds[departmentName];

    db.query("INSERT INTO role_table (title, salary, department_id) VALUES (?, ?, ?)", [newRole, salary, departmentId], (err, data) => {
        if (err) {
            throw err;
        }
        listOfRoleTitles.push(newRole);
        roleTitlesToIds[newRole] = data.insertId;
        console.log("\nAdded " + newRole + " to role_table\n");
        runMain();
    })
}

const addEmployee = async () => {
    const { firstName, lastName, roleTitle, managerName } = await inquirer.prompt(employeePrompt);
    const roleId = roleTitlesToIds[roleTitle];
    const managerId = employeeNamesToIds[managerName];

    db.query("INSERT INTO employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [firstName, lastName, roleId, managerId], (err, data) => {
        if (err) {
            throw err;
        }
        listOfEmployeeNames.push(firstName + " " + lastName);
        employeeNamesToIds[firstName + " " + lastName] = data.insertId;
        console.log("\nAdded " + firstName + " " + lastName + " to employee_table\n");
        runMain();
    });
}

const updateEmployeeRole = async () => {
    const { employeeName, newRoleTitle } = await inquirer.prompt(updateEmployeePrompt);
    const roleId = roleTitlesToIds[newRoleTitle];
    const employeeId = employeeNamesToIds[employeeName];

    db.query("UPDATE employee_table SET role_id = ? WHERE id = ?", [roleId, employeeId], (err, data) => {
        if (err) {
            throw err;
        }
        console.log("\nUpdated " + employeeName + "'s role\n");
        runMain();
    });
}

const runMain = async () => {
    const { mainMenuPick } = await inquirer.prompt(mainMenuQuestions);

    switch (mainMenuPick) {
        case "View all departments":
            viewAllDepartments();
            break;
        case "View all roles":
            viewAllRoles();
            break;
        case "View all employees":
            viewAllEmployees();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee's role":
            updateEmployeeRole();
            break;
        default: 
            keepLooping = false;
            console.log("\nThank you for using the Employee Management System\n");
            db.end();
            break;
        }
}

const App = async () => {
    buildNameArrays();
    console.log("\nWelcome to the Employee Management System!\n");
    runMain();
}

App();