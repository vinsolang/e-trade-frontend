# Contributing

Thanks for contributing! Below are small guidelines for working on this project.

Repository conventions
- Main branch: `main`
- Package manager: npm
- Linting: ESLint configured in `eslint.config.js`

Developing locally
1. Install dependencies: `npm install`
2. Start the mock API and dev server: `npm run dev`
3. Work in feature branches and open pull requests against `main`.

Data safety
- `db.json` is used by `json-server` and will be modified by API requests (POST/PATCH/DELETE). Keep a backup if you need to preserve test data.

Style
- Tailwind CSS utility classes are used heavily. Keep UI changes consistent with existing patterns.

Reporting issues
- Open issues for bugs or feature requests. Include steps to reproduce and screenshots when helpful.

