import { MessageCircle, Users as UsersIcon, Lightbulb, Trophy } from 'lucide-react';

const skillCategories = [
  {
    name: 'Communication',
    icon: MessageCircle,
    score: 85,
    color: 'bg-blue-500',
    employees: 248,
  },
  {
    name: 'Teamwork',
    icon: UsersIcon,
    score: 92,
    color: 'bg-green-500',
    employees: 248,
  },
  {
    name: 'Problem Solving',
    icon: Lightbulb,
    score: 78,
    color: 'bg-purple-500',
    employees: 248,
  },
  {
    name: 'Leadership',
    icon: Trophy,
    score: 88,
    color: 'bg-orange-500',
    employees: 248,
  },
];

const topPerformers = [
  { name: 'Sarah Williams', skills: ['Leadership', 'Communication'], avgScore: 95 },
  { name: 'Mike Johnson', skills: ['Teamwork', 'Problem Solving'], avgScore: 93 },
  { name: 'Jane Smith', skills: ['Communication', 'Leadership'], avgScore: 91 },
  { name: 'John Doe', skills: ['Problem Solving', 'Teamwork'], avgScore: 89 },
  { name: 'Tom Brown', skills: ['Leadership', 'Teamwork'], avgScore: 87 },
];

function Softskills() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Soft Skills Assessment</h1>
        <p className="text-gray-600">Track and improve essential workplace competencies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((skill) => {
          const Icon = skill.icon;
          return (
            <div key={skill.name} className="bg-white rounded-lg shadow-md p-6">
              <div className={`${skill.color} p-3 rounded-lg inline-block mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-gray-800 font-semibold mb-2">{skill.name}</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-800">{skill.score}</p>
                  <p className="text-sm text-gray-500">Avg Score</p>
                </div>
                <p className="text-sm text-gray-500">{skill.employees} employees</p>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div
                  className={`${skill.color} h-2 rounded-full`}
                  style={{ width: `${skill.score}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Performers</h2>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    {performer.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{performer.name}</p>
                    <div className="flex gap-2 mt-1">
                      {performer.skills.map((skill) => (
                        <span key={skill} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">{performer.avgScore}</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Skill Distribution</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Skill distribution chart would go here</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h2>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm font-medium text-blue-900">Focus on Problem Solving</p>
            <p className="text-sm text-blue-700 mt-1">
              Consider organizing workshops to improve analytical thinking across teams
            </p>
          </div>
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm font-medium text-green-900">Teamwork Excellence</p>
            <p className="text-sm text-green-700 mt-1">
              Great collaboration scores! Maintain momentum with team-building activities
            </p>
          </div>
          <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
            <p className="text-sm font-medium text-orange-900">Leadership Development</p>
            <p className="text-sm text-orange-700 mt-1">
              Identify high-potential employees for leadership training programs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Softskills;
