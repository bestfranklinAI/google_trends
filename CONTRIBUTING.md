# Contributing to Google Trends Explorer

Thank you for your interest in contributing to Google Trends Explorer! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/google-trends.git
   cd google-trends
   ```

2. **Set up Backend**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Frontend**
   ```bash
   cd src/frontend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🏗️ Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature development
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the coding standards below
   - Write tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Backend tests
   python -m pytest tests/backend/ -v
   
   # Frontend tests
   cd src/frontend
   npm test
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for function parameters and return values
- Write docstrings for all functions and classes
- Use meaningful variable and function names
- Keep functions small and focused

**Example:**
```python
def fetch_trends(geo: str, hl: str = "en") -> TrendsResponse:
    """
    Fetch trending topics for a specific location.
    
    Args:
        geo: Two-letter country code (e.g., "US", "HK")
        hl: Language code (e.g., "en", "zh")
    
    Returns:
        TrendsResponse: Parsed trending topics data
    
    Raises:
        HTTPException: If the request fails
    """
    # Implementation here
```

### TypeScript/React (Frontend)

- Use TypeScript for all new code
- Follow React hooks best practices
- Use meaningful component and variable names
- Keep components small and focused
- Use proper TypeScript types

**Example:**
```typescript
interface TrendData {
  title: string;
  ranking: number;
  searchVolume: string;
  changePercentage: string;
}

const TrendItem: React.FC<{ trend: TrendData }> = ({ trend }) => {
  return (
    <div className="trend-item">
      <h3>{trend.title}</h3>
      <span>#{trend.ranking}</span>
    </div>
  );
};
```

## 🧪 Testing

### Backend Testing

- Write unit tests for all new functions
- Use pytest fixtures for common test data
- Test both success and error cases
- Aim for >80% code coverage

**Example:**
```python
def test_parse_trends_success():
    """Test successful parsing of trends data."""
    html_content = "<html>...</html>"
    result = parse_trends(html_content)
    
    assert len(result.topics) > 0
    assert result.topics[0].title is not None
    assert result.topics[0].ranking > 0
```

### Frontend Testing

- Write component tests using React Testing Library
- Test user interactions and state changes
- Mock external API calls

**Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPanel } from './FilterPanel';

test('updates location when option is selected', () => {
  render(<FilterPanel onFilterChange={jest.fn()} />);
  
  const locationSelect = screen.getByLabelText('Location');
  fireEvent.change(locationSelect, { target: { value: 'US' } });
  
  expect(locationSelect).toHaveValue('US');
});
```

## 📋 Pull Request Guidelines

### PR Title Format

Use conventional commits format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### PR Description Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added and passing
```

### Review Process

1. **Automated Checks**: All CI/CD checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: All tests must pass
4. **Documentation**: Update relevant documentation

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - OS and version
   - Python version
   - Node.js version
   - Browser (for frontend issues)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Error Messages**
   - Full error messages
   - Stack traces
   - Console logs

## 💡 Feature Requests

For new features:

1. **Use Case**: Describe the problem this solves
2. **Proposed Solution**: Your suggested approach
3. **Alternatives**: Other solutions considered
4. **Additional Context**: Screenshots, examples, etc.

## 📚 Documentation

### API Documentation

- Use OpenAPI/Swagger format
- Include request/response examples
- Document all parameters and return values

### README Updates

- Keep installation instructions current
- Update feature lists for new functionality
- Include usage examples

### Code Comments

- Explain complex logic
- Document API endpoints
- Include TODO items for future improvements

## 🏆 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Hall of Fame section (coming soon)

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and ideas
- **Discord**: For real-time chat (coming soon)

## 📜 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) code of conduct. By participating, you are expected to uphold this code.

## 🙏 Thank You

Every contribution, no matter how small, helps make this project better. Thank you for your time and effort!

---

Happy coding! 🎉
