# TagTracker

A lightweight inventory tracking system with RFID-inspired workflow management. Built with Node.js, MongoDB, and React/Ionic, deployed via Google Cloud Run with Kubernetes configurations.

## Features

- Track inventory items with status management
- Mobile-friendly interface built with React/Ionic
- RESTful API backend with Node.js and Express
- MongoDB database for data persistence
- Containerized deployment with Docker
- Kubernetes configuration for orchestration

## Tech Stack

- Frontend: React + Ionic
- Backend: Node.js + Express
- Database: MongoDB
- Deployment: Google Cloud Run
- Containerization: Docker
- Orchestration: Kubernetes

## Project Structure

```
tagtracker/
├── client/                   # Ionic + React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── AddItem.tsx
│   │   └── App.tsx
│   ├── package.json
│   └── ionic.config.json
│
├── server/                   # Node.js + Express backend
│   ├── index.js
│   ├── routes/
│   │   └── items.js
│   ├── models/
│   │   └── Item.js
│   ├── .env
│   └── package.json
│
├── k8s/                      # Kubernetes configs
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── service.yaml
│
├── Dockerfile                # (or Dockerfiles in both client/ and server/)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker
- Google Cloud SDK
- kubectl

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   ```bash
   # In server/.env
   MONGODB_URI=your_mongodb_uri
   PORT=3000
   ```

4. Start the development servers:
   ```bash
   # Start backend
   cd server
   npm start

   # Start frontend
   cd ../client
   npm start
   ```

## Deployment

The application is configured for deployment on Google Cloud Run with Kubernetes. See the `k8s/` directory for deployment configurations.

## License

MIT 