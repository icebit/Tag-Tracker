# Tag Tracker

A lightweight asset tracking system. Tag Tracker helps you monitor and manage assets using RFID tags with real-time updates.

- **Frontend**: React + Ionic + TypeScript
- **Backend**: Node.js + Express + MongoDB
- **Real-time**: Socket.IO
- **Visualization**: Chart.js

## Quick Start

1. Clone and install:
   ```bash
   git clone https://github.com/icebit/Tag-Tracker.git
   cd Tag-Tracker
   ```

2. Set up the server:
   ```bash
   # In server/.env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

3. Run the app:
   ```bash
   # Terminal 1
   cd server && npm start
   
   # Terminal 2
   cd client && ionic serve
   ```

## Planned Features

- Real-time asset tracking
- Tag management (add, view, update)
- Status monitoring (inStock, inTransit, delivered, lost)
- Location history
- Split view navigation