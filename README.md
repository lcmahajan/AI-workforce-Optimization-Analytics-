# 🧠 AI Workforce Optimization Platform

A comprehensive full-stack application for optimizing workforce allocation, tracking employee performance, and providing AI-powered insights for HR operations.

## 📋 Features

- **Employee Management** - Complete CRUD operations for employee records
- **Fitment Analysis** - AI-powered role-to-employee matching and recommendations
- **Soft Skills Assessment** - Track communication, teamwork, leadership, and problem-solving
- **Fatigue Detection** - Monitor employee wellness and prevent burnout
- **AI Assistant** - Get intelligent insights and recommendations
- **Real-time Analytics** - Dashboard with performance metrics and trends

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
ai-workforce-optimization-platform/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   ├── config/
│   │   └── db.js             # Database configuration
│   ├── models/
│   │   └── employeeModel.js  # Employee schema
│   ├── controllers/
│   │   └── employeeController.js  # Business logic
│   ├── routes/
│   │   └── employeeRoutes.js # API endpoints
│   └── .env.example          # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles
│   │   ├── components/       # Reusable components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AIAssistant.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Employees.jsx
│   │   │   ├── FitmentAnalysis.jsx
│   │   │   ├── Softskills.jsx
│   │   │   └── FatigueAnalysis.jsx
│   │   └── context/
│   │       └── AuthContext.jsx  # Authentication state
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .gitignore
├── README.md
└── package.json              # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-workforce-optimization-platform
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In backend directory
   cp .env.example .env
   
   # Edit .env and add your MongoDB connection string
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/workforce
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

### Running the Application

#### Development Mode

**Option 1: Run Backend and Frontend Separately**

```bash
# Terminal 1 - Run backend
cd backend
npm run dev

# Terminal 2 - Run frontend
cd frontend
npm run dev
```

**Option 2: Run from Root (if configured)**

```bash
# Install root dependencies first
npm install

# Run both concurrently
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

#### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production mode
cd ../backend
npm start
```

## 🔑 API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Example Request

```bash
# Create new employee
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "IT",
    "role": "Software Engineer",
    "fitmentScore": 85
  }'
```

## 👤 Default Credentials

For demo purposes, use these credentials to log in:
- **Email**: admin@example.com
- **Password**: password

## 📊 Features in Detail

### 1. Dashboard
- Real-time workforce metrics
- Performance trends visualization
- Recent activity feed
- Key performance indicators (KPIs)

### 2. Employee Management
- Search and filter employees
- Add, edit, delete employee records
- View detailed employee profiles
- Track fitment scores and productivity

### 3. Fitment Analysis
- AI-powered role matching
- Career path recommendations
- Skill gap identification
- Performance predictions

### 4. Soft Skills Assessment
- Communication tracking
- Teamwork evaluation
- Leadership scoring
- Problem-solving metrics

### 5. Fatigue Analysis
- Burnout risk detection
- Work-life balance monitoring
- Wellness recommendations
- Workload optimization

### 6. AI Assistant
- Natural language queries
- Intelligent recommendations
- Performance insights
- Quick action buttons

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Tailwind CSS Customization

Edit `frontend/tailwind.config.js` to customize colors, spacing, and more:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

## 🧪 Testing

```bash
# Run backend tests (when implemented)
cd backend
npm test

# Run frontend tests (when implemented)
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment (Heroku Example)

```bash
cd backend
heroku create your-app-name
git push heroku main
heroku config:set MONGO_URI=your_connection_string
```

### Frontend Deployment (Netlify/Vercel)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to Netlify or Vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing library
- Tailwind CSS for the utility-first framework
- MongoDB for the flexible database
- All contributors and supporters

## 📞 Support

For support, email support@example.com or open an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
