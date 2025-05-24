# DOMjudge_clone

DOMjudge_clone is an automated system for running programming contests, supporting live judging, multiple languages, team management, and scoreboards. It is inspired by the original DOMjudge system and is designed for extensibility and ease of use.

## Project Structure

- **backend/**: Java Spring Boot REST API for contest management, authentication, problems, submissions, teams, and admin tools.
- **frontend/**: React + TypeScript + Vite web client for users, teams, and admins, featuring live scoreboard, submissions, and problem browsing.
- **executors/**: Language-specific isolated code execution environments (C, C++, Java, Python) using Docker, each with its own API for secure judging.
- **docker-compose.yml**: Orchestrates the backend, frontend, and all executors for local or production deployment.

## Key Features

- User/team registration and authentication
- Problem browsing and detailed problem statements
- Solution submission in multiple languages (C, C++, Java, Python)
- Automated judging with real-time feedback
- Live scoreboard and ranking
- Admin panel for contest and user management
- Modular executor architecture for easy language extension

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Java 17+ (for backend development)
- Node.js 18+ and npm/yarn (for frontend development)

### Quick Start (All-in-One with Docker Compose)

```bash
git clone <this-repo-url>
cd DOMjudge_clone
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)

### Manual Development Setup

#### Backend

```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Executors

Each executor (C, C++, Java, Python) can be run via its own Dockerfile in `executors/`. Use `docker-compose` for orchestration.

## Folder Overview

- `backend/` - Java Spring Boot API, problem definitions, and configuration
- `frontend/` - React app (see `frontend/README.md` for details)
- `executors/` - Dockerized code runners for each supported language
- `docker-compose.yml` - Multi-service orchestration

## Extending the System

- Add new languages: Create a new executor in `executors/` with a Dockerfile and API
- Add new problems: Place problem descriptions in `backend/problems_description/`
- Customize frontend: Edit or add screens/components in `frontend/src/`

## License

This project is licensed under the MIT License.

---

For more details on the frontend, see `frontend/README.md`. For backend API details, see `backend/HELP.md` or the source code.
