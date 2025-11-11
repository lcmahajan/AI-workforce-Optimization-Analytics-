import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Clock, Battery } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fatigueData = [
  { week: "Week 1", avg: 25, threshold: 40 },
  { week: "Week 2", avg: 32, threshold: 40 },
  { week: "Week 3", avg: 38, threshold: 40 },
  { week: "Week 4", avg: 45, threshold: 40 },
  { week: "Week 5", avg: 52, threshold: 40 },
  { week: "Week 6", avg: 48, threshold: 40 },
];

const atRiskEmployees = [
  {
    id: "1",
    name: "James Brown",
    role: "Backend Developer",
    fatigueScore: 78,
    avgHours: 52,
    consecutiveDays: 12,
    status: "high-risk",
  },
  {
    id: "2",
    name: "Lisa Anderson",
    role: "Project Manager",
    fatigueScore: 65,
    avgHours: 48,
    consecutiveDays: 9,
    status: "medium-risk",
  },
  {
    id: "3",
    name: "David Kim",
    role: "Data Analyst",
    fatigueScore: 58,
    avgHours: 45,
    consecutiveDays: 7,
    status: "medium-risk",
  },
];

const getRiskBadge = (status: string) => {
  switch (status) {
    case "high-risk":
      return <Badge variant="destructive">High Risk</Badge>;
    case "medium-risk":
      return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
    default:
      return <Badge variant="secondary">Low Risk</Badge>;
  }
};

export default function Fatigue() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Fatigue Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor workload and identify burnout indicators
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-1">Employees need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Fatigue Score</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">42%</div>
            <p className="text-xs text-muted-foreground mt-1">Below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">43h</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burnout Alerts</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">2</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fatigue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fatigueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Avg Fatigue"
              />
              <Line
                type="monotone"
                dataKey="threshold"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Threshold"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">At-Risk Employees</h2>
        <div className="space-y-4">
          {atRiskEmployees.map((employee) => (
            <Card key={employee.id} data-testid={`card-at-risk-${employee.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{employee.name}</h3>
                        {getRiskBadge(employee.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {employee.role}
                      </p>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Battery className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Fatigue Score:</span>
                          <span className="font-mono font-semibold text-destructive">
                            {employee.fatigueScore}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Avg Hours:</span>
                          <span className="font-mono font-semibold">
                            {employee.avgHours}h/week
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Consecutive Days:</span>
                          <span className="font-mono font-semibold">
                            {employee.consecutiveDays}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
