const express = require('express');
const app = express();
const fs = require('fs').promises
const PORT = process.env.PORT || 8080
app.use(express.json());
const path = require('path');

app.get('/greeting', (req, res) => {
    return res.send('Hello world!');
});
var c = 0;
const dataFilePath = path.join(__dirname, 'employees.json');
let employees = [];


const loadData = async () => {
    try {
        const fileData = await fs.readFile(dataFilePath, 'utf-8');
        employees = JSON.parse(fileData);
    } catch (error) {
        console.error('Error loading data:', error.message);
    }
};


const saveData = async () => {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(employees, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving data:', error.message);
    }
};


loadData();


app.post('/employee', (req, res) => {
    const { name, city } = req.body;
    const id = (employees.length + 1).toString();

  const newEmployee = { employeeId:id, name, city };
  employees.push(newEmployee);

  
  saveData();

  res.status(201).json({ employeeId: newEmployee.employeeId.toString() });
}
);



app.get('/employee/:id', (req, res) => {

    const id = (req.params.id).toString();
  
  const foundEmployee = employees.find((employee) => employee.employeeId === id);
  
  if (foundEmployee) {
    res.json(foundEmployee);
  } else {
    res.status(404).json({ message: "Employee with " + id + " was not found" });
  }

});

// Get all Employee details
app.get('/employees/all', (req, res) => {
    return res.send(employees);
});

 
        app.post('/employees/search', (req, res) => {
            const { fields, condition = 'AND' } = req.body;
          
         
    
            const applyCriterion = (employee, criterion) => {
              switch (criterion.fieldName) {
                case 'name':
                  return (criterion.eq && criterion.eq === employee.name) || (criterion.neq && criterion.neq !== employee.name);
                case 'city':
                  return (criterion.eq && criterion.eq === employee.city) || (criterion.neq && criterion.neq !== employee.city);
               
                default:
                  return true;
              }
            };
          
         
            const filteredEmployees = employees.filter((employee) => {
              return condition === 'AND'
                ? fields.every((criterion) => applyCriterion(employee, criterion))
                : fields.some((criterion) => applyCriterion(employee, criterion));
            });
          
       
            return res.status(200).json(filteredEmployees);
   
          
      });
      



app.listen(PORT, () => {
    console.log("Server running at PORT", PORT);
});