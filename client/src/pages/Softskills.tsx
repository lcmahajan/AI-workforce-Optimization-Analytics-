import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, Users, Target, Heart, Lightbulb } from "lucide-react";

const employees = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Developer",
    scores: {
      communication: 92,
      teamwork: 88,
      leadership: 85,
      problemSolving: 95,
      empathy: 87,
      creativity: 90,
    },
  },
  {
    id: "2",
    name: "Mike Chen",
    role: "Product Manager",
    scores: {
      communication: 95,
      teamwork: 92,
      leadership: 93,
      problemSolving: 88,
      empathy: 91,
      creativity: 85,
    },
  },
  {
    id: "3",
    name: "Emma Wilson",
    role: "UX Designer",
    scores: {
      communication: 90,
      teamwork: 91,
      leadership: 78,
      problemSolving: 89,
      empathy: 95,
      creativity: 97,
    },
  },
];

const skillCategories = [
  { name: "Communication", icon: MessageSquare, key: "communication" },
  { name: "Teamwork", icon: Users, key: "teamwork" },
  { name: "Leadership", icon: Target, key: "leadership" },
  { name: "Problem Solving", icon: Brain, key: "problemSolving" },
  { name: "Empathy", icon: Heart, key: "empathy" },
  { name: "Creativity", icon: Lightbulb, key: "creativity" },
];

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-blue-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

export default function Softskills() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Softskills Assessment</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Behavioral analytics and soft skill evaluation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-primary">89%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Teamwork
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-primary">87%</div>
            <p className="text-xs text-muted-foreground mt-1">Team collaboration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Leadership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-primary">82%</div>
            <p className="text-xs text-muted-foreground mt-1">Leadership potential</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {employees.map((employee) => (
          <Card key={employee.id} data-testid={`card-employee-skills-${employee.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skillCategories.map((skill) => {
                  const score =
                    employee.scores[skill.key as keyof typeof employee.scores];
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.key}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{skill.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span
                            className={`text-sm font-mono font-semibold ${getScoreColor(score)}`}
                          >
                            {score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
