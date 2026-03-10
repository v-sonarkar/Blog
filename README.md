# Blog_FullStack

A full-stack blog application with:
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React + Vite
- **Admin panel** for managing blogs and comments

## Project Structure

```
Blog_FullStack/
  backend/
  client/
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB connection string (Atlas/local)

## 1) Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` and add your environment variables (example):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
GEMINI_API_KEY=your_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Run backend:

```bash
npm run dev
```

If `dev` script is not configured, use:

```bash
npm start
```

Backend should run on the port configured in your `.env` (or default in code).

## 2) Client Setup

```bash
cd ../client
npm install
npm run dev
```

Vite will print the local URL (commonly `http://localhost:5173`).

## 3) Running Full App

Open two terminals:

- Terminal 1: run backend (`backend/`)
- Terminal 2: run frontend (`client/`)

Make sure frontend API base URL points to your backend server.

## Available Commands

### Backend (`backend/`)
- `npm run dev` – run in development mode (if configured)
- `npm start` – run production/server mode

### Client (`client/`)
- `npm run dev` – start Vite dev server
- `npm run build` – build for production
- `npm run preview` – preview production build

## Notes

- Keep secrets in `.env` and do not commit them.
- Ensure CORS is configured in backend for your frontend origin.
- Check `client/vercel.json` if deploying frontend on Vercel.

## License

For personal/learning use unless you define a project license.
