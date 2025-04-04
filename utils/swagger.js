// utils/swagger.js
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal API",
      version: "1.0.0",
      description: "An API for managing users, companies, jobs, and applications",
      contact: {
        name: "API Support",
        url: "https://yourdomain.com/support",
        email: "support@yourdomain.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "https://zithara_backend.onrender.com/api/v1", // Always point to production server for company
        description: "Production server"
      },
      {
        url: "http://localhost:3000/api/v1",  
        description: "Development server"
      }

    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            message: {
              type: "string",
              example: "Error message"
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: [
    "./routes/*.js",
    "./controllers/*.js",
    "./models/*.js"
  ]
};

export default swaggerOptions;