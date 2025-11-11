import { Users, Briefcase, TrendingUp, AlertTriangle } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { WorkDistributionChart } from "@/components/WorkDistributionChart";
import { FitmentScoreChart } from "@/components/FitmentScoreChart";
import { ProductivityChart } from "@/components/ProductivityChart";
import { RecentActivityFeed } from "@/components/RecentActivityFeed";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's an overview of your workforce.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild data-testid="button-upload-data">
            <Link href="/upload">Upload Data</Link>
          </Button>
          <Button asChild data-testid="button-view-analytics">
            <Link href="/analytics">View Analytics</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Employees"
          value={245}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Active Tasks"
          value={1248}
          icon={Briefcase}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Avg Productivity"
          value="87%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="Alerts"
          value={12}
          icon={AlertTriangle}
          subtitle="Requires attention"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkDistributionChart />
        <FitmentScoreChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductivityChart />
        </div>
        <RecentActivityFeed />
      </div>
    </div>
  );
}
