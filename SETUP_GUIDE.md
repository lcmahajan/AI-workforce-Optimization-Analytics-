# 🚀 Setup Guide - AI Workforce Optimization Platform

## 📦 What You Have

Your project is now organized with a clean frontend/backend structure:

```
Project Root/
├── backend/              ✅ Complete Express + MongoDB backend
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   ├── config/
│   ├── models/
│   ├── controllers/
│   └── routes/
│
├── frontend/             ✅ Complete React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── README.md
└── .gitignore
```

## 📥 How to Download as ZIP

### Option 1: Download from Replit
1. Click the **three dots menu** (⋮) in the top-right
2. Select **"Download as ZIP"**
3. Extract the ZIP file on your computer

### Option 2: Use Git
```bash
# If you have git configured
git clone <your-replit-url>
```

## 🛠️ Installation on Your Computer

After downloading the ZIP:

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally or use MongoDB Atlas (cloud)
# Update backend/.env with your connection string
MONGO_URI=mongodb://localhost:27017/workforce
```

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/workforce
   ```

## ▶️ Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 🔑 Default Login

- **Email**: admin@example.com
- **Password**: password

## ✅ Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 3000
- [ ] MongoDB connection successful
- [ ] Can login to the application
- [ ] Can view dashboard
- [ ] API calls working (check browser console)

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
# Update MONGO_URI in backend/.env
# Check port 5000 is not in use
```

### Frontend won't start
```bash
# Delete node_modules and package-lock.json
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
The backend is configured with CORS enabled. If you still face issues:
```javascript
// backend/server.js - CORS is already configured
app.use(cors());
```

## 📦 Building for Production

### Build Frontend
```bash
cd frontend
npm run build
# Creates optimized build in 'dist' folder
```

### Deploy Backend
```bash
cd backend
# Set NODE_ENV=production in .env
npm start
```

## 🌐 Deployment Options

### Backend
- Heroku
- Railway
- Render
- DigitalOcean

### Frontend
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🎯 Next Steps

1. ✅ Download the project as ZIP
2. ✅ Install dependencies
3. ✅ Set up MongoDB
4. ✅ Run backend and frontend
5. ⚡ Start building your features!

## 📞 Need Help?

Check the main README.md for detailed documentation and API endpoints.

---

**Happy Coding! 🚀**
