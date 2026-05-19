# Testing Guide for School Management System

## Overview
This project uses Vitest as the testing framework with comprehensive unit and integration tests.

## Test Structure
```
tests/
├── utils/                  # Utility function tests
│   └── time.utils.test.ts
├── services/               # Service layer tests
│   ├── timetable-validator.test.ts
│   ├── timetable-generator.test.ts
│   └── validation.test.ts
├── middleware/             # Middleware tests
│   └── error.middleware.test.ts
├── integration/            # API integration tests
│   ├── school.api.test.ts
│   └── timetable.api.test.ts
├── errors.test.ts          # Error handling tests
└── setup.ts                # Test configuration
```

## Running Tests

### Local Development
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage

# Run specific test file
pnpm test timetable-validator

# Run tests matching a pattern
pnpm test -- -t "conflict"
```

### Docker Environment
```bash
# Run tests in container
docker-compose --profile test up test

# Run tests with coverage in container
docker-compose --profile test up test -- pnpm run test:coverage
```

## Test Categories

### Unit Tests
- **Utility Functions**: Time calculations, date helpers
- **Services**: Business logic validation, conflict detection
- **Middleware**: Error handling, authentication, validation
- **Models**: Schema validation, associations

### Integration Tests
- **API Endpoints**: REST API functionality
- **Database Operations**: CRUD operations with real DB
- **Service Integration**: Multi-service workflows

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect, vi } from 'vitest';
import { myService } from '../src/services/my.service';

describe('MyService', () => {
  it('should do something', async () => {
    const result = await myService.doSomething();
    expect(result).toBe(expected);
  });
});
```

### Integration Test Example
```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('API Endpoint', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### Mocking Dependencies
```typescript
vi.mock('../src/models', () => ({
  Model: {
    findAll: vi.fn(),
    create: vi.fn()
  }
}));
```

## Coverage Requirements
- Services: >80% coverage
- Controllers: >75% coverage
- Utilities: >90% coverage
- Overall: >80% coverage

## CI/CD Integration
Tests run automatically on:
- Pull requests
- Push to main branch
- Before deployment

## Debugging Tests
```bash
# Run with verbose output
pnpm test -- --reporter=verbose

# Run specific test suite
pnpm test -- -t "TimetableValidator"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/vitest run
```

## Common Issues

### Database Connection Errors
Ensure PostgreSQL is running and test database exists:
```bash
docker-compose up postgres
```

### Port Conflicts
Change ports in .env file:
```bash
PORT=3001
DB_PORT=5433
```

### Mock Issues
Clear mocks between tests:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Best Practices
1. Use descriptive test names
2. Test one thing per test case
3. Use beforeEach for setup
4. Clean up after tests (afterEach/afterAll)
5. Mock external dependencies
6. Use test factories for complex objects
7. Keep tests independent and idempotent
