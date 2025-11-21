# Contributing to INAMSOS

Thank you for your interest in contributing to the Indonesia National Cancer Database System (INAMSOS)!

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yoppiari/tumor-registry.git
cd tumor-registry

# Switch to main branch
git checkout main

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development environment
docker compose up -d

# Run database migrations
cd backend && npm run db:migrate
npm run db:seed
```

### 2. Branch Naming Convention

- `feature/user-authentication` - New features
- `fix/login-validation` - Bug fixes
- `docs/api-endpoints` - Documentation
- `refactor/user-service` - Code refactoring
- `hotfix/security-patch` - Critical fixes

### 3. Code Standards

#### Backend (NestJS/TypeScript)
- Use TypeScript strict mode
- Follow NestJS best practices
- Implement proper error handling
- Write unit tests for new features
- Use proper DTOs and validation

#### Frontend (Next.js/TypeScript)
- Use TypeScript for all components
- Follow React best practices
- Implement proper error boundaries
- Write component tests
- Use Tailwind CSS for styling

#### Database
- Use descriptive table and column names
- Write proper migrations
- Include proper indexes for performance
- Use database constraints for data integrity

### 4. Commit Guidelines

#### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples
```
feat(auth): implement MFA for user login

Add two-factor authentication using speakeasy
- Generate MFA secrets during registration
- Verify TOTP codes during login
- Update user interface for MFA setup

Closes #123
```

### 5. Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code standards
   - Write tests
   - Update documentation

3. **Test Your Changes**
   ```bash
   # Run tests
   cd backend && npm run test
   cd ../frontend && npm run test

   # Check linting
   cd backend && npm run lint
   cd ../frontend && npm run lint
   ```

4. **Create Pull Request**
   - Provide clear description
   - Link related issues
   - Request review from team members

5. **Code Review**
   - Address review feedback
   - Ensure tests pass
   - Update documentation

### 6. Testing Strategy

#### Unit Tests
- Test individual functions and methods
- Mock external dependencies
- Aim for >80% code coverage

#### Integration Tests
- Test API endpoints
- Test database interactions
- Test authentication flows

#### E2E Tests
- Test critical user journeys
- Test multi-user scenarios
- Test data validation

### 7. Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication and authorization
- Follow OWASP security best practices

### 8. Performance Guidelines

- Optimize database queries
- Implement caching where appropriate
- Monitor application performance
- Use lazy loading for large datasets

### 9. Documentation

- Update README.md for major changes
- Document API endpoints
- Update user documentation
- Comment complex code logic

### 10. Deployment Process

1. **Staging Environment**
   - Deploy to staging first
   - Run full test suite
   - Perform manual testing

2. **Production Deployment**
   - Create deployment branch
   - Run automated tests
   - Deploy to production
   - Monitor for issues

## Code Review Checklist

### Functionality
- [ ] Code implements the specified requirements
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Code is tested thoroughly

### Code Quality
- [ ] Code follows project standards
- [ ] Code is readable and maintainable
- [ ] No duplicate code
- [ ] Proper comments where needed

### Security
- [ ] No hardcoded secrets
- [ ] Input validation is implemented
- [ ] Authentication/authorization is correct
- [ ] SQL injection prevention

### Performance
- [ ] Efficient database queries
- [ ] No memory leaks
- [ ] Appropriate caching
- - [ ] Resource usage is reasonable

## Getting Help

- Check existing documentation
- Search for similar issues
- Ask questions in team discussions
- Create issue for bugs or feature requests

## Code of Conduct

Be respectful, constructive, and professional in all interactions. Focus on what is best for the community and the project.

---

Thank you for contributing to INAMSOS! 🇮🇩