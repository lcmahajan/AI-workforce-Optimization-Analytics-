import { Users, TrendingUp, Target, AlertCircle } from 'lucide-react';

const stats = [
  {
    title: 'Total Employees',
    value: '248',
    change: '+12%',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Avg Fitment Score',
    value: '87.5',
    change: '+5.2%',
    icon: Target,
    color: 'bg-green-500',
  },
  {
    title: 'Productivity',
    value: '92%',
    change: '+8%',
    icon: TrendingUp,
    color: 'bg-purple-500',
  },
  {
    title: 'High Fatigue',
    value: '12',
    change: '-3%',
    icon: AlertCircle,
    color: 'bg-orange-500',
  },
];

const recentActivities = [
  { name: 'John Doe', action: 'completed', task: 'Fitment Analysis', time: '2 hours ago' },
  { name: 'Jane Smith', action: 'started', task: 'Training Program', time: '4 hours ago' },
  { name: 'Mike Johnson', action: 'updated', task: 'Soft Skills Assessment', time: '6 hours ago' },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Real-time workforce analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Performance Trends
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.name}</span>
                    {' '}{activity.action}{' '}
                    <span className="text-primary-600">{activity.task}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
