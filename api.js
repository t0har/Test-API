var db = require ('./databaseoperations');
let html_to_pdf = require ('html-pdf-node');
var Employe = require  ('./Employe');
const databaseoperations = require('./databaseoperations');


var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use((request,response,next)=>{
    console.log('middleware');
    next();
 })

 router.route('/Employee').get((request,response)=>{

    databaseoperations.getEmployee().then(result => {
       response.json(result[0]);
    })

})

router.route('/Employee/:id').get((request,response)=>{

    databaseoperations.getEmploye(request.params.id).then(result => {
       response.json(result[0]);
    })

})

router.route('/Employee').post((request,response)=>{

    let Employe = {...request.body}

    databaseoperations.addEmploye(Employe, response).then(result => {
       response.status(200).json(result);
    })

})

router.route('/Employee/:id').delete((request, response) => {
    databaseoperations.deleteEmployee(request.params.id).then(result => {
        if (result > 0) {
            response.status(200).json({ message: 'Employé supprimé ' });
        } else {
            response.status(404).json({ message: 'Employé non trouvé ' });
        }
    });
});

router.route('/Employee/:id').put((request, response) => {
    let updatedEmployee = { ...request.body };

    databaseoperations.updateEmployee(request.params.id, updatedEmployee).then(result => {
        if (result > 0) {
            response.status(200).json({ message: 'Employé mis a jour ' });
        } else {
            response.status(404).json({ message: 'Employé non trouvé ' });
        }
    });
});

// ...

router.route('/Employee/:id/copy').get(async (request, response) => {
    try {
        const employeeId = request.params.id;
        const employee = await databaseoperations.getEmploye(employeeId);
        const employeeData = employee[0][0];

        let html_string = `
            <table>
                <tr>
                    <th>Employee ID: ${employeeData.EmployeeId}</th>
                    <th>First Name: ${employeeData.FirstName}</th>
                    <th>Last Name: ${employeeData.LastName}</th>
                    <th>Salary: ${employeeData.Salary}</th>
                    <th>Joining Date: ${employeeData.JoiningDate}</th>
                    <th>Department: ${employeeData.Department}</th>
                </tr>
            </table>
        `;

        let options = {
            format: 'A4',
            timeout: 0,
        };

        let file = {
            content: html_string
        };

        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            console.log("PDF Buffer:", pdfBuffer);
            response.set('Content-type', 'application/pdf');
            response.send(pdfBuffer);
        }).catch(error => {
            console.log(error);
            response.status(500).json({ message: 'Erreur lors de la génération du PDF' });
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: 'Erreur lors de la récupération des données de l\'employé' });

    }
});



const qr = require('qr-image');


router.route('/Employee/:id/qr').get((request, response) => {
    /*
  const employeeId = request.params.id;
  
  databaseoperations.getEmploye(employeeId).then(result => {
    const employee = result[0][0];
    
    const qrCode = qr.image(employeeId.toString(), { type: 'png' });
    response.setHeader('Content-type', 'image/png');
    qrCode.pipe(response);
  }).catch(error => {
    console.log(error);
    response.status(500).json({ message: 'Erreur lors de la récupération des données de l\'employé' });
  });*/
});

// ...

  
  


  router.route('/Employee/ByVille/:villeId').get((request, response) => {
    const villeId = request.params.villeId;
  
    databaseoperations.getEmployeesByVille(villeId).then(result => {
        response.json(result);
    }).catch(error => {
        console.log(error);
        response.status(500).json({ message: 'Internal server error' });
    });
});

//const swagger = require('./swagger');

//swagger(app);

const swaggerDocument = {
    "swagger": "2.0",
    "info": {
        "description": "This is a simple example NodeJS API project to demonstrate Swagger Documentation",
        "version": "1.0.0",
        "title": "Tasks API",
        "contact": {
            "email": "abc@gmail.com"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        }
    },
    "schemes": ["http"],
    "host": "localhost:3080",
    "basePath": "/api",
    "paths" : {
        "/todos" : {
            "get" : {
                "summary" : "Get all the tasks",
                "description": "Get all the tasks",
                "produces": ["application/json"],
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/todosResponse"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid status value",
                        "schema": {
                            "$ref": "#/definitions/InvalidResponse"
                        }
                    }
                }
            }
        },
        "/todo" : {
            "post" : {
                "summary" : "Save the task",
                "description": "Save the task",
                "produces": ["application/json"],
                "consumes": ["application/json"],
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "task" : {
                                    "type": "object",
                                    "$ref": "#/definitions/Task"
                                } 
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/todosResponse"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid status value",
                        "schema": {
                            "$ref": "#/definitions/InvalidResponse"
                        }
                    }
                }
            }
        },
        "/todos/{id}" : {
            "put" : {
                "summary" : "Update the tasks",
                "description": "Update the tasks",
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "task id that needs to be deleted",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "in": "body",
                        "name": "body",
                        "description": "task object",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "task" : {
                                    "type": "object",
                                    "$ref": "#/definitions/Task"
                                } 
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/todosResponse"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid status value",
                        "schema": {
                            "$ref": "#/definitions/InvalidResponse"
                        }
                    }
                }
            }
        },
        "/todo/{id}" : {
            "delete" : {
                "summary" : "Delete the task",
                "description": "Delete the task",
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "task id that needs to be deleted",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/todosResponse"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid status value",
                        "schema": {
                            "$ref": "#/definitions/InvalidResponse"
                        }
                    }
                }
            }
        }
    }, 
    "definitions": {
        "todosResponse": {
            "type": "object",
            "properties": {
                "id": {
                     "type": "integer"
                },
                "task": {
                    "type": "string"
                },
                "assignee": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                }
            }
        },
        "Task": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "string"
                },
                "assignee": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                }
            }
        },
        "InvalidResponse": {
            "type": "object",
            "properties": {
                "statusCode": {
                    "type": "string"
                },
                "message": {
                    "type": "string"
                }
            }

        }
    }
};
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const fs = require('fs');

const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');


//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));

app.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));

var port = process.env.PORT || 7075;
app.listen(port);   
console.log('Order API is runnning at ' + port);


