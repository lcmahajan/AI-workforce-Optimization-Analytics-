import { AlertTriangle, TrendingDown, Clock, Calendar } from 'lucide-react';

const fatigueData = [
  { name: 'John Doe', level: 'High', workHours: 62, daysOff: 2, score: 82, status: 'Critical' },
  { name: 'Jane Smith', level: 'Medium', workHours: 48, daysOff: 4, score: 58, status: 'Monitor' },
  { name: 'Mike Johnson', level: 'Low', workHours: 40, daysOff: 6, score: 28, status: 'Healthy' },
  { name: 'Sarah Williams', level: 'Medium', workHours: 52, daysOff: 3, score: 64, status: 'Monitor' },
  { name: 'Tom Brown', level: 'High', workHours: 58, daysOff: 1, score: 76, status: 'Critical' },
];

function FatigueAnalysis() {
  const stats = [
    { title: 'High Fatigue', value: '12', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Medium Risk', value: '35', icon: TrendingDown, color: 'bg-yellow-500' },
    { title: 'Avg Work Hours', value: '48h', icon: Clock, color: 'bg-blue-500' },
    { title: 'Days Off Avg', value: '3.2', icon: Calendar, color: 'bg-green-500' },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Fatigue Analysis</h1>
        <p className="text-gray-600">Monitor employee wellness and prevent burnout</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
              <div className={`${stat.color} p-3 rounded-lg inline-block mb-3`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Employee Fatigue Levels</h2>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span> High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span> Low
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fatigue Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekly Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Off (Month)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fatigue Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fatigueData.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                        {employee.name[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(employee.level)}`}>
                      {employee.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.workHours}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.daysOff} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            employee.score >= 70 ? 'bg-red-500' : 
                            employee.score >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${employee.score}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-semibold ${getScoreColor(employee.score)}`}>
                        {employee.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      employee.status === 'Critical' ? 'text-red-600' :
                      employee.status === 'Monitor' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommended Actions</h2>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3">
            <AlertTriangle className="text-red-600 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-red-900">Critical: 2 employees at high risk</p>
              <p className="text-sm text-red-700 mt-1">
                Immediate intervention required. Schedule wellness check-ins and adjust workload.
              </p>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-sm font-medium text-yellow-900">Monitor: 35 employees showing signs</p>
            <p className="text-sm text-yellow-700 mt-1">
              Consider redistributing tasks and ensuring adequate breaks.
            </p>
          </div>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm font-medium text-blue-900">Preventive Measures</p>
            <p className="text-sm text-blue-700 mt-1">
              Implement flexible working hours and promote work-life balance initiatives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FatigueAnalysis;
