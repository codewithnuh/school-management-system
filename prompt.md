I have deleted my docker and docker compose files I want you to reqrite them this is my .env 

# Application settings
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database settings
DB_HOST=db
DB_PORT=3307
DB_NAME=school_management
DB_PASSWORD=rootpassword
DATABASE_URI=mysql://root:rootpassword@db:3307/school_management

# JWT settings
JWT_SECRET="asdksweIsasd$@ljaksdj"
JWT_EXPIRES_IN=1d

# Email settings
EMAIL_APP_PASSWORD="tphh osje xmgg wkhd"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="TLS"
EMAIL_SENDER_NAME="School Management System"
EMAIL_USER="nuh25792@gmail.com"

# Upload settings
UPLOADTHING_TOKEN="eyJhcGlLZXkiOiJza19saXZlXzMwNzkwYzUyYjJkYmFlZjY5NTMyZGQwMGEzNzM5YzYwZWJmMzNiZTNmNjU1N2FlNmRmODU5Mjg3M2RkMjBmYWIiLCJhcHBJZCI6ImxyZG1hdXJ6NHMiLCJyZWdpb25zIjpbInNlYTEiXX0="

# MySQL Docker settings
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=school_management and this si my packag json ''{
    "name": "school-management-system",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "type": "module",
    "scripts": {
        "start": "node  dist/app.js",
        "format:check": "prettier --check .",
        "format:write": "prettier --write .",
        "dev": "tsx --no-cache --watch src/app.ts",
        "build": "pnpm exec tsc  && tsc-alias",
        "lint:check": "eslint .",
        "lint:fix": "eslint --fix .",
        "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
        "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
        "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "@auth/express": "^0.8.4",
        "@auth/sequelize-adapter": "^2.7.4",
        "@types/nodemailer": "^6.4.17",
        "bcryptjs": "^2.4.3",
        "body-parser": "^1.20.3",
        "compression": "^1.7.5",
        "cookie-parser": "^1.4.7",
        "cors": "^2.8.5",
        "csurf": "^1.11.0",
        "dotenv": "^16.4.7",
        "express": "^5.0.1",
        "express-rate-limit": "^7.5.0",
        "helmet": "^8.0.0",
        "jose": "^5.9.6",
        "jsonwebtoken": "^9.0.2",
        "morgan": "^1.10.0",
        "mysql2": "^3.12.0",
        "node-cron": "^3.0.3",
        "nodemailer": "^6.10.0",
        "reflect-metadata": "^0.2.2",
        "sequelize": "^6.37.5",
        "sequelize-typescript": "^2.1.6",
        "swagger-jsdoc": "^6.2.8",
        "swagger-ui-express": "^5.0.0",
        "uploadthing": "^7.5.2",
        "useragent": "^2.3.0",
        "uuid": "^11.0.5",
        "winston": "^3.17.0",
        "zod": "^3.24.1"
    },
    "devDependencies": {
        "@eslint/eslintrc": "^3.2.0",
        "@eslint/js": "^9.19.0",
        "@faker-js/faker": "^9.4.0",
        "@types/bcryptjs": "^2.4.6",
        "@types/body-parser": "^1.19.5",
        "@types/compression": "^1.7.5",
        "@types/cookie-parser": "^1.4.8",
        "@types/cors": "^2.8.17",
        "@types/csurf": "^1.11.5",
        "@types/express": "^5.0.0",
        "@types/express-serve-static-core": "^5.0.6",
        "@types/helmet": "^4.0.0",
        "@types/jest": "^29.5.12",
        "@types/js-yaml": "^4.0.9",
        "@types/jsonwebtoken": "^9.0.8",
        "@types/morgan": "^1.9.9",
        "@types/node": "^22.10.10",
        "@types/node-cron": "^3.0.11",
        "@types/sequelize": "^4.28.20",
        "@types/supertest": "^6.0.2",
        "@types/swagger-jsdoc": "^6.0.4",
        "@types/swagger-ui-express": "^4.1.6",
        "@types/useragent": "^2.3.4",
        "eslint": "^9.19.0",
        "eslint-config-prettier": "^10.0.1",
        "globals": "^15.14.0",
        "jest": "^29.7.0",
        "js-yaml": "^4.1.0",
        "prettier": "^3.4.2",
        "supertest": "^7.0.0",
        "ts-jest": "^29.1.2",
        "ts-node": "^10.9.2",
        "tsc-alias": "^1.8.10",
        "tsx": "^4.19.2",
        "typescript-eslint": "^8.21.0"
    },
    "packageManager": "pnpm@10.3.0+sha1.6981f53a2d726323a7fd5f 4ca5107102338511c8"
}
'' make sure not to make any mistake my contanier is '
nodejs-22.14.0

cf6b482f9438

node:22.14.0
N/A

46 minutes ago
mysql8-container

840f4556d1ed

mysql:8
3307:3306⁠
'' I am using node js 22.14.0 so you should use it 