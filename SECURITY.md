# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please bring it to our attention right away!

### How to Report

**Please do NOT report security vulnerabilities using GitHub issues.**

Instead, please:

1. **Email**: Send details to [security@yourproject.com] (replace with your actual email)
2. **Subject**: Include "SECURITY" in the subject line
3. **Details**: Provide as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### What to Expect

- **Response Time**: We aim to respond within 24 hours
- **Updates**: We'll keep you updated on our progress
- **Credit**: We'll credit you in our security advisory (if desired)
- **Timeline**: We aim to fix critical vulnerabilities within 7 days

### Security Best Practices

This project follows these security practices:

#### Backend Security
- Input validation and sanitization
- CORS configuration
- Rate limiting (planned)
- Dependency vulnerability scanning
- No sensitive data in logs

#### Frontend Security
- Content Security Policy (CSP)
- XSS protection
- Secure API communication
- No sensitive data in client-side code

#### Infrastructure Security
- Environment variable management
- Secure defaults
- Regular dependency updates
- Docker security best practices

### Dependencies

We regularly monitor our dependencies for security vulnerabilities using:
- GitHub Security Advisories
- Snyk vulnerability scanning
- Dependabot alerts
- npm audit (for frontend)
- pip-audit (for backend)

### Disclosure Policy

When we receive a security report:

1. **Confirmation**: We'll confirm the vulnerability
2. **Fix**: We'll develop and test a fix
3. **Release**: We'll release a patched version
4. **Disclosure**: We'll publicly disclose the issue after the fix is available

### Bug Bounty

We don't currently offer a bug bounty program, but we deeply appreciate security researchers who help us keep our project secure. We'll acknowledge your contribution in our security advisories.

---

Thank you for helping keep Google Trends Explorer secure!
