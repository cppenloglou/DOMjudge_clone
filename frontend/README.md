# DOMjudge Clone Frontend

This is the frontend for the DOMjudge Clone project, built with **React**, **TypeScript**, and **Vite**. It provides a modern, responsive interface for programming contest management, including user authentication, problem viewing, submissions, team management, and a live scoreboard.

## Project Structure

- **src/components/**: Reusable UI components (e.g., `Navbar`, `LoadingSpinner`, and UI elements)
- **src/layouts/**: Page and section layouts for consistent structure (e.g., `NavBarLayout`, `PageLayout`)
- **src/context/**: React Contexts for global state (e.g., `AuthContext`, `ProblemContext`, `TeamContext`, etc.)
- **src/screens/**: Main application pages (e.g., `Home`, `Login`, `Register`, `Problems`, `ProblemPage`, `AdminPage`, `Scoreboard`, `Profile`)
- **src/services/**: API service modules for backend communication (`api.ts`, `apiServices.ts`)
- **src/utils/**: Utility functions and route protection (`AdminRoute`, `ProtectedRoutes`)
- **public/**: Static assets

## Key Features

- **Authentication**: Login, registration, and protected routes
- **Problem Management**: View problems, problem details, and submit solutions
- **Submissions**: Track and view submission status
- **Teams**: Team management and context
- **Scoreboard**: Live contest scoreboard
- **Admin Tools**: Admin-only routes and pages
- **Responsive UI**: Modern, user-friendly interface

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
cd frontend
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` by default.

### Linting & Formatting

- ESLint is configured for TypeScript and React. Run:

```bash
npm run lint
```

- You can expand ESLint rules in `eslint.config.js` as needed.

### Building for Production

```bash
npm run build
```

## Customization & Extending

- Add new pages in `src/screens/`
- Add new context providers in `src/context/`
- Add or update API calls in `src/services/`
- Add new layouts in `src/layouts/`

## Project Architecture

- **State Management**: Uses React Context for authentication, problems, teams, submissions, roles, and timers.
- **Routing**: Protected and admin routes via custom utilities.
- **API Communication**: All backend calls are abstracted in the `services` layer.
- **Component-Driven**: UI is built from modular, reusable components.

## Contributing

1. Fork the repo and create your branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
