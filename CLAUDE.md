# CLAUDE.md - AI Assistant Guide

This document provides guidance for AI assistants working on the SOUVERAINETE-NUMERIQUE (Digital Sovereignty) project.

## Project Overview

**Repository:** SOUVERAINETE-NUMERIQUE
**Status:** Initial Setup / Pre-Development
**Primary Language:** To be determined

This project focuses on digital sovereignty topics. The repository is in its early initialization phase and awaits technology stack selection and implementation.

## Repository Structure

```
SOUVERAINETE-NUMERIQUE/
├── README.md          # Project overview and documentation
├── CLAUDE.md          # This file - AI assistant guidance
└── (future directories and files to be added)
```

### Planned Structure (To Be Implemented)

As the project develops, expect the following structure:

```
SOUVERAINETE-NUMERIQUE/
├── src/               # Source code
├── tests/             # Test files
├── docs/              # Documentation
├── config/            # Configuration files
├── scripts/           # Utility scripts
├── README.md
├── CLAUDE.md
├── .gitignore
└── [package.json/requirements.txt/etc.]
```

## Development Workflow

### Git Conventions

- **Main Branch:** `main` (or as configured)
- **Feature Branches:** Use descriptive names with prefixes:
  - `feature/` - New features
  - `fix/` - Bug fixes
  - `docs/` - Documentation updates
  - `refactor/` - Code refactoring
  - `claude/` - AI-assisted development branches

### Commit Message Format

Use clear, descriptive commit messages:

```
<type>: <short description>

[optional body with more details]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`

### Before Committing

1. Ensure all tests pass (when testing is configured)
2. Follow code style guidelines (when established)
3. Update documentation if needed
4. Keep commits focused and atomic

## Code Conventions

### General Principles

- Write clean, readable, and maintainable code
- Follow the DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Comment complex logic, but prefer self-documenting code
- Handle errors gracefully

### Documentation Standards

- Document all public APIs and functions
- Keep README.md up to date with setup instructions
- Include usage examples in documentation

## Testing Guidelines

_Testing framework to be configured._

When implemented:

- Write tests for new features
- Maintain test coverage
- Run tests before committing
- Follow the testing pyramid (unit > integration > e2e)

## Build & Run

_Build system to be configured._

When implemented, common commands will be documented here:

```bash
# Install dependencies
# [command to be added]

# Run development server
# [command to be added]

# Run tests
# [command to be added]

# Build for production
# [command to be added]
```

## Dependencies

_No dependencies configured yet._

As dependencies are added, they will be documented here with their purposes.

## Key Files Reference

| File | Purpose |
|------|---------|
| `README.md` | Project overview and user documentation |
| `CLAUDE.md` | AI assistant guidance (this file) |

## AI Assistant Guidelines

### When Working on This Project

1. **Read First:** Always read relevant files before making changes
2. **Understand Context:** Review related code and documentation
3. **Small Changes:** Make focused, incremental changes
4. **Test Changes:** Verify changes work as expected
5. **Document:** Update documentation when making significant changes

### Do Not

- Make changes without understanding the existing code
- Introduce breaking changes without discussion
- Add unnecessary dependencies
- Over-engineer solutions
- Ignore existing patterns and conventions

### Security Considerations

- Never commit secrets, API keys, or credentials
- Validate all external inputs
- Follow security best practices for the chosen stack
- Be cautious with third-party dependencies

## Project-Specific Notes

### Digital Sovereignty Focus

This project relates to digital sovereignty (souveraineté numérique), which encompasses:

- Data privacy and control
- Technological independence
- Digital rights and freedoms
- Local/national technological infrastructure

Keep these themes in mind when contributing to the project.

## Getting Help

- Review existing documentation in the repository
- Check issue tracker for known problems
- Follow established patterns in the codebase

---

_Last Updated: 2026-01-28_
_This document should be updated as the project evolves._
