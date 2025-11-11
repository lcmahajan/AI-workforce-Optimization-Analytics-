import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, ArrowUpDown } from "lucide-react";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [towerFilter, setTowerFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [fitmentFilter, setFitmentFilter] = useState("all");

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
              <tr>
                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                  No employees found. Add employees or adjust your filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
