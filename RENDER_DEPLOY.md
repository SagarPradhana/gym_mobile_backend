# Deploy To Render

## Files Added

- `render.yaml`: Render blueprint configuration
- `.env.example`: environment variable template

## Before You Deploy

1. Push this project to GitHub.
2. Make sure your MongoDB Atlas cluster allows Render to connect.
3. Rotate any secrets that were stored in your local `.env` if they were shared anywhere.

## Render Setup

### Option 1: Blueprint Deploy

1. Open Render.
2. Click `New +`.
3. Choose `Blueprint`.
4. Connect your GitHub repository.
5. Render will detect `render.yaml`.
6. Add these required environment variables in Render:

   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `MONGO_URI`

7. Deploy the service.

### Option 2: Manual Web Service

If you do not want to use the blueprint:

1. Open Render.
2. Click `New +` -> `Web Service`.
3. Connect your GitHub repository.
4. Use these settings:

   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

5. Add these environment variables:

   - `PORT=3200`
   - `JWT_SECRET=your-secret`
   - `JWT_REFRESH_SECRET=your-refresh-secret`
   - `MONGO_URI=your-mongodb-uri`

## Health Check

Render health check path:

```text
/health
```

Example response:

```json
{
  "status": "ok",
  "service": "forgefit-api"
}
```

## After Deploy

Your API base URL will look like:

```text
https://forgefit-api.onrender.com
```

Examples:

- `https://forgefit-api.onrender.com/health`
- `https://forgefit-api.onrender.com/auth/login`
- `https://forgefit-api.onrender.com/users`
