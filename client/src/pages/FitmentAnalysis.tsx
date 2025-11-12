import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, Users, TrendingUp, Award, Building2, Settings2 } from "lucide-react";

interface FitmentMetrics {
  totalEmployees: number;
  avgFitmentScore: number;
  highPerformers: number;
  departments: number;
}

interface EmployeeFitment {
  id: number;
  employeeName: string;
  department: string;
  currentRole: string;
  recommendedRole: string;
  fitmentScore: number;
  status: "Fit" | "Unfit" | "Train to Fit" | "Overfit";
}

// Set to true to load sample data for demonstration purposes
const LOAD_SAMPLE_DATA = false;

export default function FitmentAnalysis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  
  const [metrics, setMetrics] = useState<FitmentMetrics>({
    totalEmployees: 0,
    avgFitmentScore: 0.0,
    highPerformers: 0,
    departments: 0,
  });

  const [employees, setEmployees] = useState<EmployeeFitment[]>([]);

  // Load sample data if LOAD_SAMPLE_DATA flag is enabled
  // In production, this will be replaced with API calls or CSV upload handlers
  useEffect(() => {
    if (LOAD_SAMPLE_DATA) {
      // Simulate API call or CSV data load
      const sampleMetrics: FitmentMetrics = {
        totalEmployees: 5,
        avgFitmentScore: 7.8,
        highPerformers: 2,
        departments: 3,
      };

      const sampleEmployees: EmployeeFitment[] = [
        {
          id: 1,
          employeeName: "Sarah Johnson",
          department: "Engineering",
          currentRole: "Senior Developer",
          recommendedRole: "Tech Lead",
          fitmentScore: 8.5,
          status: "Fit",
        },
        {
          id: 2,
          employeeName: "Mike Chen",
          department: "Sales",
          currentRole: "Sales Rep",
          recommendedRole: "Account Manager",
          fitmentScore: 7.2,
          status: "Fit",
        },
        {
          id: 3,
          employeeName: "Emma Wilson",
          department: "Marketing",
          currentRole: "Marketing Coordinator",
          recommendedRole: "Marketing Coordinator",
          fitmentScore: 6.8,
          status: "Train to Fit",
        },
        {
          id: 4,
          employeeName: "David Park",
          department: "Engineering",
          currentRole: "Junior Developer",
          recommendedRole: "Senior Developer",
          fitmentScore: 5.5,
          status: "Train to Fit",
        },
        {
          id: 5,
          employeeName: "Lisa Anderson",
          department: "HR",
          currentRole: "HR Manager",
          recommendedRole: "HR Director",
          fitmentScore: 9.2,
          status: "Fit",
        },
      ];

      setMetrics(sampleMetrics);
      setEmployees(sampleEmployees);
    }
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || 
        emp.department.toLowerCase() === departmentFilter.toLowerCase();
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchQuery, departmentFilter]);

  const highPerformersPercentage = metrics.totalEmployees > 0
    ? ((metrics.highPerformers / metrics.totalEmployees) * 100).toFixed(0)
    : "0";

  const getStatusVariant = (status: EmployeeFitment["status"]) => {
    switch (status) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Employee Fitment Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive employee-role fitment scoring with advanced filtering and sorting.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate transition-all" data-testid="card-total-employees">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-total-employees">
              {metrics.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
            <p className="text-xs text-primary mt-2">Active workforce</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all" data-testid="card-avg-fitment">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Fitment Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-avg-fitment">
              {metrics.avgFitmentScore.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall employee-role fit</p>
            <p className="text-xs text-primary mt-2">Out of 10.0</p>
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
              {metrics.highPerformers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Score ≥ 8.0</p>
            <p className="text-xs text-primary mt-2">{highPerformersPercentage}% of total</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all" data-testid="card-departments">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departments
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" data-testid="text-departments">
              {metrics.departments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unique departments</p>
            <p className="text-xs text-primary mt-2">Organization units</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Employee Fitment Data</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View, sort, and filter employee fitment scores across departments and roles.
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-columns">
              <Settings2 className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search employees…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-fitment"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-department-filter">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">
                    <button 
                      className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" 
                      data-testid="button-sort-name"
                    >
                      Employee Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button 
                      className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" 
                      data-testid="button-sort-department"
                    >
                      Department
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button 
                      className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" 
                      data-testid="button-sort-current-role"
                    >
                      Current Role
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button 
                      className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" 
                      data-testid="button-sort-recommended-role"
                    >
                      Recommended Role
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button 
                      className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" 
                      data-testid="button-sort-fitment-score"
                    >
                      Fitment Score
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    <button 
                      className="flex items-center gap-1 hover-elevate rounded-md px-2 py-1 -mx-2 -my-1" 
                      data-testid="button-sort-status"
                    >
                      Status
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
                      data-testid="text-no-results"
                    >
                      No results found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr 
                      key={employee.id} 
                      className="border-b hover:bg-muted/50 transition-colors"
                      data-testid={`row-employee-${employee.id}`}
                    >
                      <td className="p-4">
                        <div className="font-medium">{employee.employeeName}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {employee.department}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{employee.currentRole}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium">
                          {employee.recommendedRole}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-mono font-semibold">
                          {employee.fitmentScore.toFixed(1)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={getStatusVariant(employee.status)}
                          data-testid={`badge-status-${employee.id}`}
                        >
                          {employee.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
