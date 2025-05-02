# Deployment Guide

This guide explains how to deploy both the server and client components of TagTracker to Google Cloud Run.

## Prerequisites

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Log in to your Google Cloud account:
   ```bash
   gcloud auth login
   ```
3. Set your project ID:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Server Deployment

1. Build and push the server Docker image:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tagtracker-server ./server
   ```

2. Deploy the server to Cloud Run:
   ```bash
   gcloud run deploy tagtracker-server \
     --image gcr.io/YOUR_PROJECT_ID/tagtracker-server \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. Note the server URL provided after deployment. You'll need this for the client configuration.

## Client Deployment

1. Build and push the client Docker image:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tagtracker-client ./client
   ```

2. Deploy the client to Cloud Run:
   ```bash
   gcloud run deploy tagtracker-client \
     --image gcr.io/YOUR_PROJECT_ID/tagtracker-client \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. Note the client URL provided after deployment.

## Post-Deployment Configuration

1. Update the server's CORS configuration in `server/index.js` to include the deployed client URL
2. Update the client's API configuration in `client/src/config.ts` to use the deployed server URL

## Local Development

For local development:
- Server runs on `http://localhost:3000`
- Client runs on `http://localhost:8100`
- MongoDB connection string should be set in the server's `.env` file 