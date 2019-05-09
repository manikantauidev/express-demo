const Joi = require('joi');
const express = require('express');
const app = express();

// To read Request body we need to parse the request //
app.use(express.json());

// Defining Courses //
const courses = [
    { id: 1, name: 'Angular JS' },
    { id: 2, name: 'Angular 2+' },
    { id: 3, name: 'React JS' },
    { id: 4, name: 'Express JS' },
    { id: 5, name: 'Mongo DB' },
    { id: 6, name: 'Node JS' }
];

// Defining Our Routes or API Methods //
app.get('/', (req, res) => {
    let obj = {};
    obj.status = true;
    obj.statusCode = 200;
    obj.message = 'Welcome to ExpressJS Framework.'
    res.status(200).send(obj);
});

// Reading Multiple Param from Request //
app.get('/api/params/:year/:month', (req, res) => {
    let obj = {};
    obj.status = true;
    obj.statusCode = 200;
    obj.message = 'Parameters list';
    obj.data = req.params;
    res.status(200).send(obj);
});

// Reading Query Params from Request //
/* In Browser trigger the url as : 
    "http://localhost:3000/api/queries/2019/05?sortBy=name"
*/
app.get('/api/queries/:year/:month', (req, res) => {
    let obj = {};
    obj.status = true;
    obj.statusCode = 200;
    obj.message = 'Query Params list';
    obj.data = req.query;
    res.status(200).send(obj);
});

// Get All Courses //
app.get('/api/courses', (req, res) => {
    let obj = {};
    obj.status = true;
    obj.statusCode = 200;
    obj.message = 'Courses list';
    obj.data = courses;
    res.status(200).send(obj);
});

// Get Details of Single Course By Id //
app.get('/api/courses/:id', (req, res) => {
    // res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    let obj = {};
    if (!course) {
        obj.status = false;
        obj.statusCode = 404;
        obj.message = `Course with id ${req.params.id} was not found.`;
        obj.data = null;
        res.status(404).send(obj);
    }
    else {
        obj.status = true;
        obj.statusCode = 200;
        obj.message = 'Course details.';
        obj.data = course;
        res.status(200).send(obj);
    }
});

// Creating a new Entry using POST method && Error Handling //
app.post('/api/courses', (req, res) => {
    let obj = {};
    // Validating Inputs using Joi in reqular way //
    /*
        const schema = {
            name: Joi.string().min(3).required()
        };
        const result = validateCourse(req.body, schema);
    */

    // Validating Inputs using Joi calling a function //
    const result = validateCourse(req.body);
    // Getting error using Object Destructioring //
    const { error } = validateCourse(req.body); // result.error
    /* Can use error ==>> result.error */

    // console.log(result);
    if (result.error) {
        obj.status = false;
        obj.statusCode = 400;
        obj.message = result.error.details[0].message;
        return res.status(400).send(obj);
    }

    // Regular Way of handling inputs //
    // if(!req.body.name || req.body.name.length < 3) return res.status(400).send('Name is required and should be minimum 3 characters.');

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    obj.status = true;
    obj.statusCode = 200;
    obj.message = 'Created a new course.';
    obj.data = course;
    return res.status(200).send(obj);
});

// Updating an Entry using PUT method && Error Handling //
app.put('/api/courses/:id', (req, res) => {
    let obj = {};
    // Look up for the course //
    const course = courses.find(c => c.id === parseInt(req.params.id));

    // If not exists, return 404 //
    if (!course) {
        obj.status = false;
        obj.statusCode = 404;
        obj.message = `Course with id ${req.params.id} was not found.`;
        obj.data = null;
        return res.status(404).send(obj);
    }
    // Validating Inputs using Joi in regular way //
    /*
        const schema = {
            name: Joi.string().min(3).required()
        };
        const result = Joi.validate(req.body, schema);
    */

    // Validating Inputs using Joi calling a function //
    const result = validateCourse(req.body);

    // If Invalid, return 400 - Bad Request //
    if (result.error) {
        obj.status = false;
        obj.statusCode = 404;
        obj.message = result.error.details[0].message;
        obj.data = null;
        return res.status(400).send(obj);
    }
    // Update the course //
    course.name = req.body.name;
    // return the response/course //
    obj.status = true;
    obj.statusCode = 200;
    obj.message = 'Course updated successfully.';
    obj.data = course;
    return res.status(200).send(obj);
});

// Deleting an Entry using DELETE method && Error Handling //
app.delete('/api/courses/:id', (req, res) => {
    let obj = {};
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        obj.status = false;
        obj.statusCode = 404;
        obj.message = `Course with id ${req.params.id} was not found.`;
        obj.data = null;
        return res.status(404).send(obj);
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    obj.status = true;
    obj.statusCode = 200;
    obj.message = 'Course deleted successfully.';
    obj.data = course;
    return res.status(200).send(obj);
});

// Defining A Port for Dynamic Environment/Production insted of user defined Port //
const port = process.env.port || 3000;

// To set an environmental port, Run the command //
// set PORT = 5000; (This is on Windows OS);

app.listen(port, () => {
    console.log(`Listening on port ${port}...!!!`);
});


// Common function to handle the Error or Validations of Inputs //
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}
