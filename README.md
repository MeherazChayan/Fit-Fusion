# Fit Fusion

Fit Fusion is a full-stack fitness and wellness application that brings workout planning, nutrition tools, progress tracking, and wellness resources into one place. It includes a React frontend and an Express/MongoDB backend with JWT-based authentication.

## Features

- Account registration, login, and protected pages
- User profile and dashboard
- BMI and calorie calculators
- Calorie, water-intake, and fitness progress tracking
- Workout routines and exercise videos
- Diet charts and recipes
- Yoga, meditation, and relaxing music
- Gym finder map
- Fitness blog and product shop interface
- Admin-protected user management endpoints

## Tech stack

### Frontend

- React 18 and React Router
- Vite
- Tailwind CSS
- Axios
- React Leaflet
- Sonner notifications

### Backend

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens
- bcrypt password hashing
- CORS and dotenv

## Project structure

```text
Fit-Fusion/
|-- Backend/
|   |-- controller/       # Request handlers
|   |-- middleware/       # Authentication and admin authorization
|   |-- models/           # Mongoose models
|   |-- routes/           # Express routes
|   `-- server.js         # Backend entry point
|-- Frontend/
|   |-- public/           # Static assets and music
|   |-- src/
|   |   |-- components/   # Reusable UI components
|   |   |-- context/      # Authentication and API configuration
|   |   `-- pages/        # Application pages
|   `-- vite.config.js
`-- README.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- A local or hosted MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/MeherazChayan/Fit-Fusion.git
cd Fit-Fusion
```

### 2. Configure the backend

Create `Backend/.env` with the following variables:

```env
PORT=3500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Environment files are ignored by Git. Never commit real credentials.

Install the backend dependencies and start the API:

```bash
cd Backend
npm install
npm run dev
```

The backend runs at `http://localhost:3500` by default. Open that address to check the service status.

### 3. Start the frontend

In a separate terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

The frontend API base URL is currently configured as `http://localhost:3500/api` in `Frontend/src/context/api.jsx`.

## Available scripts

### Backend

| Command | Description |
| --- | --- |
| `npm start` | Start the backend with Node.js |
| `npm run dev` | Start the backend with Nodemon |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## API overview

The active backend routes are mounted under `/api/users`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/users` | Public | Create an account |
| `POST` | `/api/users/login` | Public | Log in |
| `GET` | `/api/users/me` | Authenticated | Get the current profile |
| `PUT` | `/api/users/update` | Authenticated | Update the current profile |
| `DELETE` | `/api/users/delete` | Authenticated | Delete the current account |
| `GET` | `/api/users/all` | Admin | List users |
| `GET` | `/api/users/:id` | Admin | Get a user by ID |
| `PUT` | `/api/users/:id` | Admin | Update a user by ID |
| `DELETE` | `/api/users/:id` | Admin | Delete a user by ID |

Authenticated requests must send a valid JWT in the authorization header.

## Production build

```bash
cd Frontend
npm run build
```

The optimized frontend output is generated in `Frontend/dist`.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes.
4. Push the branch and open a pull request.

## Author

Developed by [Meheraz Chayan](https://github.com/MeherazChayan).
