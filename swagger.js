const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de l API',
    },
    servers: [
      {
        url: 'http://localhost:7075/api',
      },
    ],
  },
  apis: ['./api.js'], 
};

const specs = swaggerJsdoc(options);


const swaggerDocument = require('./swagger.json');
module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  };
  