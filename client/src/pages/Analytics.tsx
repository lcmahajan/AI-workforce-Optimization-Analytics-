import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkDistributionChart } from "@/components/WorkDistributionChart";
import { ProductivityChart } from "@/components/ProductivityChart";
import { FitmentScoreChart } from "@/components/FitmentScoreChart";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive workforce analytics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last-30">
            <SelectTrigger className="w-40" data-testid="select-time-range">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-90">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Fitment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">82.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Task Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">91.2%</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilization Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">78.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Resource utilization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkDistributionChart />
        <FitmentScoreChart />
      </div>

      <ProductivityChart />
    </div>
  );
}
