import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Users, TrendingUp, Award, Building2, Settings2 } from "lucide-react";

export default function FitmentAnalysis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

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
            <div className="text-3xl font-bold" data-testid="text-total-employees">0</div>
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
            <div className="text-3xl font-bold" data-testid="text-avg-fitment">0.0</div>
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
            <div className="text-3xl font-bold" data-testid="text-high-performers">0</div>
            <p className="text-xs text-muted-foreground mt-1">Score ≥ 8.0</p>
            <p className="text-xs text-primary mt-2">0% of total</p>
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
            <div className="text-3xl font-bold" data-testid="text-departments">0</div>
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
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    No results found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
