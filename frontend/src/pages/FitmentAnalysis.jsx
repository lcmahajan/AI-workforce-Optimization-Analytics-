import { Users, Target, TrendingUp, Award } from 'lucide-react';

const mockData = [
  { name: 'John Doe', currentRole: 'Analyst', recommendedRole: 'Senior Analyst', score: 92, status: 'Fit' },
  { name: 'Jane Smith', currentRole: 'Developer', recommendedRole: 'Team Lead', score: 88, status: 'Fit' },
  { name: 'Mike Johnson', currentRole: 'Designer', recommendedRole: 'Designer', score: 95, status: 'Perfect Fit' },
  { name: 'Sarah Williams', currentRole: 'Manager', recommendedRole: 'Senior Manager', score: 85, status: 'Fit' },
  { name: 'Tom Brown', currentRole: 'Analyst', recommendedRole: 'Data Scientist', score: 78, status: 'Trainable' },
];

function FitmentAnalysis() {
  const stats = [
    { title: 'Total Analyzed', value: '248', icon: Users, color: 'bg-blue-500' },
    { title: 'Perfect Fit', value: '87', icon: Target, color: 'bg-green-500' },
    { title: 'Avg Score', value: '87.5', icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Top Performers', value: '45', icon: Award, color: 'bg-orange-500' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Perfect Fit':
        return 'bg-green-100 text-green-800';
      case 'Fit':
        return 'bg-blue-100 text-blue-800';
      case 'Trainable':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Fitment Analysis</h1>
        <p className="text-gray-600">AI-powered role fitment and career path recommendations</p>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Employee Fitment Scores</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommended Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fitment Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.map((employee, index) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {employee.currentRole}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {employee.recommendedRole}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${employee.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{employee.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FitmentAnalysis;
