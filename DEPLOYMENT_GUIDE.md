# Deploy to Google Cloud

## Prerequisites
1. Google Cloud account and project
2. MongoDB Atlas account
3. Node.js and npm installed

## Step 1: Set up MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Get the connection string (replace <password> with your password)
4. Whitelist your IP (0.0.0.0/0 for testing)

## Step 2: Install Google Cloud SDK
Download from: https://cloud.google.com/sdk/docs/install
Run the installer and follow prompts.

## Step 3: Authenticate and set project
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## Step 4: Enable required APIs
```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 5: Build and push backend Docker image
```bash
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/oneedu-backend
```

## Step 6: Deploy backend to Cloud Run
```bash
gcloud run deploy oneedu-backend \
  --image gcr.io/YOUR_PROJECT_ID/oneedu-backend \
  --platform managed \
  --port 4000 \
  --set-env-vars MONGODB_URI="your_mongodb_atlas_uri",JWT_SECRET="your_jwt_secret",NODE_ENV="production" \
  --allow-unauthenticated
```

Note the service URL from the output.

## Step 7: Update frontend for production
In frontend/.env.production or set VITE_API_URL to the Cloud Run URL.

## Step 8: Install Firebase CLI
```bash
npm install -g firebase-tools
```

## Step 9: Initialize Firebase (if not done)
```bash
cd frontend
firebase login
firebase init hosting
# Select your project, public directory: dist, single page app: yes
```

## Step 10: Deploy frontend
```bash
cd frontend
npm run build
firebase deploy
```

## Step 11: Update backend CORS if needed
In backend, update CORS to allow the Firebase URL.

Your app should now be live!