import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Brain, 
  Activity, 
  Bot 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Employees', path: '/employees', icon: Users },
  { name: 'Fitment Analysis', path: '/fitment', icon: Target },
  { name: 'Soft Skills', path: '/softskills', icon: Brain },
  { name: 'Fatigue Analysis', path: '/fatigue', icon: Activity },
  { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-primary-600">
          🧠 AI Workforce
        </h1>
        <p className="text-xs text-gray-500 mt-1">Optimization Platform</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
