import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Employees from './pages/Employees';
import FitmentAnalysis from './pages/FitmentAnalysis';
import Softskills from './pages/Softskills';
import FatigueAnalysis from './pages/FatigueAnalysis';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
            <Route path="/fitment" element={<PrivateRoute><FitmentAnalysis /></PrivateRoute>} />
            <Route path="/softskills" element={<PrivateRoute><Softskills /></PrivateRoute>} />
            <Route path="/fatigue" element={<PrivateRoute><FatigueAnalysis /></PrivateRoute>} />
            <Route path="/ai-assistant" element={<PrivateRoute><AIAssistant /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
