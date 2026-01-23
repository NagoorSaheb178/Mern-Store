# Unified React + Express Application

This project combines a customized React frontend (with MUI & Redux Toolkit) and an Express/MongoDB backend into a single unified directory structure.

## Features

- **Frontend**: React (v19), Redux Toolkit, Material UI, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT Authentication.
- **Unified Workflow**: Run both client and server with a single command.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Atlas connection string)

## Installation

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies** from the root directory:
    ```bash
    npm install
    ```

## Configuration

Ensure you have a `.env` file in the root directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
SERVER_PORT=5000
JWT_SECRET=your_jwt_secret
```

> **Note**: `SERVER_PORT` is used for the backend to avoid conflict with the React frontend (which defaults to port 3000).

## Deployment on Vercel

This project is configured for easy deployment on Vercel.

### Steps to Deploy:

1.  **Push to GitHub**: Push your local repository to a new GitHub repository.
2.  **Import to Vercel**: Connect your GitHub account to Vercel and import the repository.
3.  **Environment Variables**: In the Vercel project settings, add your environment variables:
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: Your secret key for authentication.
4.  **Automatic Build**: Vercel will automatically detect the configuration and run `npm run build` and then serve the application using `index.js`.

---

## Running the Application Locally

### Development (Recommended)

Run both the backend and frontend simultaneously with hot-reloading:

```bash
npm start
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend (API)**: [http://localhost:5000](http://localhost:5000)

### Production Build (Single Port)

If you want to run the production build on a single port (5000) locally:

```bash
npm run build
npm start
```

Access at `http://localhost:5000`.

## Project Structure

```
├── .env                 # Environment variables
├── index.js             # Backend entry point
├── package.json         # Unified dependencies and scripts
├── vercel.json          # Vercel deployment configuration
├── public/              # Static frontend assets
├── src/                 # React source code
├── models/              # Mongoose models
├── routes/              # Express routes
└── build/               # Generated production build (after npm run build)
```

