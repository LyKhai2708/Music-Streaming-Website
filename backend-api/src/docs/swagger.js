const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
        failOnErrors: true,
        definition: {
            openapi: '3.1.0',
            info: {
                title: 'Music App API',
                version: '1.0.0',
                description: 'A simple music app API',
            },
            servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',  // Định dạng JWT
                },
            },
        },
        security: [
            {
                bearerAuth: [],  // Áp dụng bearerAuth cho toàn bộ API
            },
        ],

    },
    apis: ['./src/routes/*.js', './src/docs/components.yaml'],
};
const specs = swaggerJsdoc(options);

module.exports = {
    specs,
    swaggerUi,
};