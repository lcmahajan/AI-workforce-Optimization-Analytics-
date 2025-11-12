import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, Users, TrendingUp, Award, AlertCircle } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string;
  tower: string;
  fitmentScore?: number; // Raw score from data upload
  fitment: "Fit" | "Unfit" | "Train to Fit" | "Overfit";
  productivity: number;
  utilization: number;
}

interface AutoInsight {
  type: "warning" | "success" | "info";
  message: string;
}

// Set to true to load sample data for demonstration purposes
const LOAD_SAMPLE_DATA = false;

// Automation: Auto-classify fitment level based on score
const autoClassifyFitment = (score: number): Employee["fitment"] => {
  if (score >= 8) return "Fit";
  if (score >= 5) return "Train to Fit";
  if (score >= 3) return "Overfit";
  return "Unfit";
};

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [towerFilter, setTowerFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [fitmentFilter, setFitmentFilter] = useState("all");
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [autoInsights, setAutoInsights] = useState<AutoInsight[]>([]);

  // Load sample data if LOAD_SAMPLE_DATA flag is enabled
  // In production, this will be replaced with API calls or CSV upload handlers
  useEffect(() => {
    if (LOAD_SAMPLE_DATA) {
      const sampleEmployees: Employee[] = [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Manager",
          tower: "IT",
          fitmentScore: 8.5,
          fitment: autoClassifyFitment(8.5),
          productivity: 92,
          utilization: 88,
        },
        {
          id: 2,
          name: "Mike Chen",
          role: "Analyst",
          tower: "Finance",
          fitmentScore: 8.2,
          fitment: autoClassifyFitment(8.2),
          productivity: 85,
          utilization: 90,
        },
        {
          id: 3,
          name: "Emma Wilson",
          role: "Specialist",
          tower: "HR",
          fitmentScore: 6.5,
          fitment: autoClassifyFitment(6.5),
          productivity: 78,
          utilization: 75,
        },
        {
          id: 4,
          name: "David Park",
          role: "Analyst",
          tower: "IT",
          fitmentScore: 5.8,
          fitment: autoClassifyFitment(5.8),
          productivity: 72,
          utilization: 80,
        },
        {
          id: 5,
          name: "Lisa Anderson",
          role: "Manager",
          tower: "Operations",
          fitmentScore: 9.2,
          fitment: autoClassifyFitment(9.2),
          productivity: 95,
          utilization: 92,
        },
        {
          id: 6,
          name: "James Brown",
          role: "Specialist",
          tower: "Finance",
          fitmentScore: 3.5,
          fitment: autoClassifyFitment(3.5),
          productivity: 88,
          utilization: 85,
        },
        {
          id: 7,
          name: "Maria Garcia",
          role: "Analyst",
          tower: "HR",
          fitmentScore: 8.0,
          fitment: autoClassifyFitment(8.0),
          productivity: 83,
          utilization: 87,
        },
        {
          id: 8,
          name: "Robert Taylor",
          role: "Manager",
          tower: "IT",
          fitmentScore: 4.2,
          fitment: autoClassifyFitment(4.2),
          productivity: 65,
          utilization: 48,
        },
      ];
      
      setEmployees(sampleEmployees);
    }
  }, []);

  // Automation: Generate insights when employee data changes
  useEffect(() => {
    if (employees.length === 0) {
      setAutoInsights([]);
      return;
    }

    const insights: AutoInsight[] = [];

    // Auto-insight: High performers
    const highPerformers = employees.filter(emp => emp.productivity > 90);
    if (highPerformers.length > 0) {
      insights.push({
        type: "success",
        message: `${highPerformers.length} high performer${highPerformers.length > 1 ? 's' : ''} detected (Productivity > 90%): ${highPerformers.map(e => e.name).join(", ")}`,
      });
    }

    // Auto-insight: Low utilization warning
    const lowUtilization = employees.filter(emp => emp.utilization < 50);
    if (lowUtilization.length > 0) {
      insights.push({
        type: "warning",
        message: `${lowUtilization.length} employee${lowUtilization.length > 1 ? 's' : ''} below 50% utilization: ${lowUtilization.map(e => e.name).join(", ")}`,
      });
    }

    // Auto-insight: Unfit employees
    const unfitEmployees = employees.filter(emp => emp.fitment === "Unfit");
    if (unfitEmployees.length > 0) {
      insights.push({
        type: "warning",
        message: `${unfitEmployees.length} employee${unfitEmployees.length > 1 ? 's' : ''} classified as Unfit - consider training or role adjustment`,
      });
    }

    // Auto-insight: Training needed
    const trainingNeeded = employees.filter(emp => emp.fitment === "Train to Fit");
    if (trainingNeeded.length > 0) {
      insights.push({
        type: "info",
        message: `${trainingNeeded.length} employee${trainingNeeded.length > 1 ? 's' : ''} would benefit from additional training`,
      });
    }

    setAutoInsights(insights);

    // Log insights to console
    console.log("=== AUTO INSIGHTS GENERATED ===");
    insights.forEach(insight => {
      console.log(`[${insight.type.toUpperCase()}] ${insight.message}`);
    });
    console.log("===============================");
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTower =
        towerFilter === "all" || 
        emp.tower.toLowerCase() === towerFilter.toLowerCase();
      const matchesRole =
        roleFilter === "all" || 
        emp.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesFitment =
        fitmentFilter === "all" || 
        emp.fitment.toLowerCase().replace(/\s+/g, "-") === fitmentFilter.toLowerCase();
      
      return matchesSearch && matchesTower && matchesRole && matchesFitment;
    });
  }, [employees, searchQuery, towerFilter, roleFilter, fitmentFilter]);

  // Automation: Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (employees.length === 0) {
      return {
        totalEmployees: 0,
        avgFitmentScore: 0,
        highPerformers: 0,
        lowUtilization: 0,
      };
    }

    const avgFitment = employees.reduce((sum, emp) => sum + (emp.fitmentScore || 0), 0) / employees.length;
    const highPerf = employees.filter(emp => emp.productivity > 90).length;
    const lowUtil = employees.filter(emp => emp.utilization < 50).length;

    return {
      totalEmployees: employees.length,
      avgFitmentScore: avgFitment,
      highPerformers: highPerf,
      lowUtilization: lowUtil,
    };
  }, [employees]);

  const getFitmentVariant = (fitment: Employee["fitment"]) => {
    switch (fitment) {
      case "Fit":
        return "default";
      case "Unfit":
        return "destructive";
      case "Train to Fit":
        return "secondary";
      case "Overfit":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Automation: Check if employee is a high performer
  const isHighPerformer = (employee: Employee) => employee.productivity > 90;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Employees</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage, analyze, and automate employee fitment and performance.
        </p>
      </div>

      {/* Auto-Generated Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate transition-all" data-testid="card-total-employees">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-total-employees">
              {summaryStats.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active workforce</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all" data-testid="card-avg-fitment">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Fitment Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-avg-fitment">
              {summaryStats.avgFitmentScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Auto-calculated average</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all" data-testid="card-high-performers">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Performers
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-high-performers">
              {summaryStats.highPerformers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Productivity &gt; 90%</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all" data-testid="card-low-utilization">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Utilization
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-low-utilization">
              {summaryStats.lowUtilization}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Below 50% utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Auto Insights Section */}
      {autoInsights.length > 0 && (
        <div className="space-y-2" data-testid="section-auto-insights">
          <h3 className="text-sm font-medium">Auto-Generated Insights</h3>
          <div className="space-y-2">
            {autoInsights.map((insight, index) => (
              <Card 
                key={index} 
                className={`border-l-4 ${
                  insight.type === 'success' ? 'border-l-green-500' :
                  insight.type === 'warning' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}
                data-testid={`insight-${index}`}
              >
                <CardContent className="py-3">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {insight.type === 'success' ? '✓' : insight.type === 'warning' ? '⚠' : 'ℹ'}
                    </span>
                    {' '}{insight.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search employees…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-employees"
          />
        </div>

        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Select value={towerFilter} onValueChange={setTowerFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-tower-filter">
              <SelectValue placeholder="Select Tower" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Towers</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-role-filter">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="specialist">Specialist</SelectItem>
            </SelectContent>
          </Select>

          <Select value={fitmentFilter} onValueChange={setFitmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-fitment-filter">
              <SelectValue placeholder="Fitment Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="fit">Fit</SelectItem>
              <SelectItem value="unfit">Unfit</SelectItem>
              <SelectItem value="train-to-fit">Train to Fit</SelectItem>
              <SelectItem value="overfit">Overfit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-sm">
                  <button className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" data-testid="button-sort-employee">
                    Employee
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-sm">
                  <button className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" data-testid="button-sort-role">
                    Role
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-sm">
                  <button className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" data-testid="button-sort-tower">
                    Tower
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-sm">
                  <button className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" data-testid="button-sort-fitment">
                    Fitment
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-sm">
                  <button className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" data-testid="button-sort-productivity">
                    Productivity
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 font-medium text-sm">
                  <button className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" data-testid="button-sort-utilization">
                    Utilization
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td 
                    colSpan={6} 
                    className="p-12 text-center text-muted-foreground"
                    data-testid="text-no-employees"
                  >
                    No employees found. Add employees or adjust your filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className={`border-b hover:bg-muted/50 transition-colors ${
                      isHighPerformer(employee) ? 'bg-green-50 dark:bg-green-950/20' : ''
                    }`}
                    data-testid={`row-employee-${employee.id}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium" data-testid={`text-name-${employee.id}`}>
                          {employee.name}
                        </div>
                        {isHighPerformer(employee) && (
                          <Badge variant="default" className="text-xs" data-testid={`badge-high-performer-${employee.id}`}>
                            ⭐ High Performer
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground" data-testid={`text-role-${employee.id}`}>
                        {employee.role}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm" data-testid={`text-tower-${employee.id}`}>
                        {employee.tower}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={getFitmentVariant(employee.fitment)}
                        data-testid={`badge-fitment-${employee.id}`}
                      >
                        {employee.fitment}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div 
                        className={`text-sm font-mono font-semibold ${
                          employee.productivity > 90 ? 'text-green-600 dark:text-green-400' : ''
                        }`}
                        data-testid={`text-productivity-${employee.id}`}
                      >
                        {employee.productivity}%
                      </div>
                    </td>
                    <td className="p-4">
                      <div 
                        className={`text-sm font-mono font-semibold ${
                          employee.utilization < 50 ? 'text-red-600 dark:text-red-400' : ''
                        }`}
                        data-testid={`text-utilization-${employee.id}`}
                      >
                        {employee.utilization}%
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
