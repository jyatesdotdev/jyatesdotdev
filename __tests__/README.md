# Portfolio Testing

This directory contains tests for the portfolio website components and functionality.

## Testing Structure

- `__tests__/components/`: Tests for React components
- Each test file is named after the component it tests with `.test.tsx` extension

## Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: For rendering and interacting with React components
- **User Event**: For simulating user interactions

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run specific tests
npx jest --testPathPattern=nav
```

## Test Guidelines

When writing tests, follow these principles:

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it's built
2. **Accessibility**: Use getByRole or getByLabelText queries when possible
3. **Mocking**: Mock external services (API calls, recaptcha) to test components in isolation
4. **User Interactions**: Use `userEvent` to simulate real user behavior

## Adding New Tests

1. Create a new test file in the appropriate directory
2. Import the component and testing utilities
3. Write test cases that verify the component's behavior
4. Run tests to ensure they pass

## Coverage

To view test coverage report:

```bash
npx jest --coverage
``` 