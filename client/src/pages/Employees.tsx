import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmployeeCard } from "@/components/EmployeeCard";
import { EmployeeTable } from "@/components/EmployeeTable";
import { Plus, Grid, List } from "lucide-react";

const mockEmployees = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Developer",
    department: "Engineering",
    email: "sarah.j@company.com",
    phone: "+1 234 567 8900",
    fitmentScore: 92,
  },
  {
    id: "2",
    name: "Mike Chen",
    role: "Product Manager",
    department: "Product",
    email: "mike.c@company.com",
    phone: "+1 234 567 8901",
    fitmentScore: 88,
  },
  {
    id: "3",
    name: "Emma Wilson",
    role: "UX Designer",
    department: "Design",
    email: "emma.w@company.com",
    phone: "+1 234 567 8902",
    fitmentScore: 95,
  },
  {
    id: "4",
    name: "James Brown",
    role: "Data Analyst",
    department: "Analytics",
    email: "james.b@company.com",
    phone: "+1 234 567 8903",
    fitmentScore: 78,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    role: "HR Manager",
    department: "Human Resources",
    email: "lisa.a@company.com",
    phone: "+1 234 567 8904",
    fitmentScore: 85,
  },
  {
    id: "6",
    name: "David Kim",
    role: "Backend Developer",
    department: "Engineering",
    email: "david.k@company.com",
    phone: "+1 234 567 8905",
    fitmentScore: 90,
  },
];

export default function Employees() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workforce and view employee details
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              data-testid="button-view-table"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button data-testid="button-add-employee">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              {...employee}
              onViewDetails={(id) => console.log("View details:", id)}
            />
          ))}
        </div>
      ) : (
        <EmployeeTable />
      )}
    </div>
  );
}
