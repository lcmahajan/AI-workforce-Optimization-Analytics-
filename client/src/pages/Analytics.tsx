import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Building2, Users } from "lucide-react";
import { WorkDistributionChart } from "@/components/WorkDistributionChart";
import { ProductivityChart } from "@/components/ProductivityChart";
import { FitmentScoreChart } from "@/components/FitmentScoreChart";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor key workforce metrics and process performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Process
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" data-testid="text-total-process">25</div>
            <Progress value={65} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">Active processes running</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consolidation Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" data-testid="text-consolidation-rate">82%</div>
            <Progress value={82} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">Process efficiency metric</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Department
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" data-testid="text-department-count">4 <span className="text-xl font-normal text-muted-foreground">Active</span></div>
            <Progress value={100} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">Departments operational</p>
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
