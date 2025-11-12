import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string;
  tower: string;
  fitment: "Fit" | "Unfit" | "Train to Fit" | "Overfit";
  productivity: number;
  utilization: number;
}

// Set to true to load sample data for demonstration purposes
const LOAD_SAMPLE_DATA = false;

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [towerFilter, setTowerFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [fitmentFilter, setFitmentFilter] = useState("all");
  
  const [employees, setEmployees] = useState<Employee[]>([]);

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
          fitment: "Fit",
          productivity: 92,
          utilization: 88,
        },
        {
          id: 2,
          name: "Mike Chen",
          role: "Analyst",
          tower: "Finance",
          fitment: "Fit",
          productivity: 85,
          utilization: 90,
        },
        {
          id: 3,
          name: "Emma Wilson",
          role: "Specialist",
          tower: "HR",
          fitment: "Train to Fit",
          productivity: 78,
          utilization: 75,
        },
        {
          id: 4,
          name: "David Park",
          role: "Analyst",
          tower: "IT",
          fitment: "Train to Fit",
          productivity: 72,
          utilization: 80,
        },
        {
          id: 5,
          name: "Lisa Anderson",
          role: "Manager",
          tower: "Operations",
          fitment: "Fit",
          productivity: 95,
          utilization: 92,
        },
        {
          id: 6,
          name: "James Brown",
          role: "Specialist",
          tower: "Finance",
          fitment: "Overfit",
          productivity: 88,
          utilization: 85,
        },
        {
          id: 7,
          name: "Maria Garcia",
          role: "Analyst",
          tower: "HR",
          fitment: "Fit",
          productivity: 83,
          utilization: 87,
        },
        {
          id: 8,
          name: "Robert Taylor",
          role: "Manager",
          tower: "IT",
          fitment: "Unfit",
          productivity: 65,
          utilization: 70,
        },
      ];
      
      setEmployees(sampleEmployees);
    }
  }, []);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Employees</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and analyze employee fitment and performance
        </p>
      </div>

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
                    className="border-b hover:bg-muted/50 transition-colors"
                    data-testid={`row-employee-${employee.id}`}
                  >
                    <td className="p-4">
                      <div className="font-medium" data-testid={`text-name-${employee.id}`}>
                        {employee.name}
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
                      <div className="text-sm font-mono font-semibold" data-testid={`text-productivity-${employee.id}`}>
                        {employee.productivity}%
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-mono font-semibold" data-testid={`text-utilization-${employee.id}`}>
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
