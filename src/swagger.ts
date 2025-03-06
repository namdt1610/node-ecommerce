import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express, Request, Response } from 'express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hero API',
            description: 'Example of CRUD API ',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:8888',
                description: 'Local Development Server',
            },
        ],
    },
    apis: ['./routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, port: number) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    // Documentation in JSON format
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

export default swaggerDocs
