# TagTracker

A web application for tracking RFID tags and their associated items. Built with React, Ionic, Node.js, and MongoDB.

## Features

- Track RFID tags and their current status (in stock, in transit, delivered, lost)
- Associate tags with items
- Real-time updates using WebSocket
- Mobile-friendly interface
- Tag scanning interface

## Tech Stack

- Frontend: React, Ionic, TypeScript
- Backend: Node.js, Express
- Database: MongoDB
- Deployment: Google Cloud Run

## Project Structure

```
tagtracker/
├── client/           # React/Ionic frontend
├── server/           # Node.js/Express backend
└── DEPLOY.md         # Deployment instructions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the server directory with your MongoDB connection string
4. Start the development servers:
   ```bash
   # Terminal 1
   cd server && npm start
   
   # Terminal 2
   cd client && npm run dev
   ```

## Deployment

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions to Google Cloud Run.

## License

MIT