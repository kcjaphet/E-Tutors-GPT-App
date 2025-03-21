
# Testing Guide for GPTTextTools Backend

This document outlines how to run tests for the GPTTextTools backend API.

## Overview

The backend uses Jest as the testing framework, alongside:
- `supertest` for HTTP assertions
- `mongodb-memory-server` for in-memory MongoDB testing

## Running Tests

### Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

### Running All Tests

From the `server` directory, run:

```bash
npm test
```

This will:
- Start an in-memory MongoDB server
- Run all test suites
- Generate coverage reports

### Running Specific Tests

To run a specific test file:

```bash
npx jest __tests__/routes/detect.test.js
```

## Test Structure

```
server/__tests__/
├── routes/                  # API route tests
│   ├── detect.test.js       # Tests for detect-ai-text endpoint
│   └── humanize.test.js     # Tests for humanize-text endpoint
└── utils/
    └── db-handler.js        # MongoDB memory server setup
```

## Writing Tests

### Route Testing Pattern

We use the following pattern for route tests:

1. Mock any external services (like OpenAI)
2. Create a test Express app with the routes
3. Use `supertest` to make requests
4. Assert on the responses

Example:

```javascript
describe('POST /api/endpoint', () => {
  it('should return expected response', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ key: 'value' })
      .expect(200);
      
    expect(response.body.success).toBe(true);
  });
});
```

## Coverage Reports

After running tests, coverage reports are generated in the `coverage` directory. You can view the HTML report by opening:

```
server/coverage/lcov-report/index.html
```

## Continuous Integration

For CI environments, you can use the following command to run tests with JUnit reporter:

```bash
npx jest --ci --reporters=default --reporters=jest-junit
```
