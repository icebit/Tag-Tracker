# Tag Tracker

A lightweight RFID tag tracking system for inventory management.

## Features

- **Tag Management**
  - Create, edit, and delete tags
  - Associate tags with items
  - Track tag status (inStock, inTransit, delivered, lost)
  - View and update tag locations
  - Monitor last seen timestamps

- **Item Management**
  - Create, edit, and delete items
  - Associate multiple tags with items
  - Add item descriptions
  - View item-tag relationships

- **Scanning Interface**
  - Mock scanning simulation
  - Customizable mock locations
  - Status updates during scanning
  - Real-time scan results display
  - Continuous scanning mode
  - Real scanning mode (planned for future implementation)

## Technology Stack

- Frontend: React with TypeScript, Ionic Framework
- Backend: Node.js, Express, MongoDB
- API: RESTful endpoints for tag and item management
- Deployment: Docker, Google Cloud Run

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start the server
   cd server
   npm run dev

   # Start the client
   cd ../client
   npm start
   ```

4. Access the application at `http://localhost:3000`

### Docker Development

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost`

### Google Cloud Run Deployment

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Initialize gcloud and set your project:
   ```bash
   gcloud init
   gcloud config set project YOUR_PROJECT_ID
   ```
3. Enable required APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com
   ```
4. Set up MongoDB Atlas or another MongoDB service and get the connection URI
5. Update the `cloudbuild.yaml` file with your MongoDB URI and API URL
6. Deploy using Cloud Build:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

Note: After deployment, you'll need to:
1. Get the Cloud Run service URL for the server
2. Update the `_API_URL` substitution in `cloudbuild.yaml` with the actual server URL
3. Redeploy the client to use the correct API URL

## Current Status

The application currently supports:
- Complete tag and item management
- Mock scanning with customizable locations and statuses
- Real-time updates of tag status and location
- Comprehensive error handling and validation

Future plans include:
- Implementation of real RFID scanning
- Enhanced analytics and reporting
- User authentication and authorization
- Mobile app support