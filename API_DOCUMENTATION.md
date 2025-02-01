# School Management System API Documentation

The API documentation is now available through Swagger UI. You can access it by:

1. Starting the application
2. Navigating to `http://localhost:3000/api-docs` in your web browser

## Authentication

Most endpoints require authentication using JWT bearer tokens. To authenticate:

1. Create a user account using `/users` POST endpoint
2. Login using `/users/auth/login` to get a JWT token
3. Include the token in subsequent requests using the Authorization header:
    ```
    Authorization: Bearer your-jwt-token
    ```

## Available Resources

The API provides the following main resources:

- Users
- Teachers
- Authentication

Each resource has its own set of endpoints documented in the Swagger UI interface.

## Running the API

```bash
# Install dependencies
pnpm install

# Start the server
pnpm start
```

The API will be available at `http://localhost:3000` and the documentation at `/api-docs`.
