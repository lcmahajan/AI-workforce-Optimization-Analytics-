import { Users, Briefcase, TrendingUp, AlertTriangle, FileText, UserCheck } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { RecentActivityFeed } from "@/components/RecentActivityFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">CVs Uploaded</span>
              <span className="text-2xl font-bold">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Job Descriptions</span>
              <span className="text-2xl font-bold">42</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fitment Matches</span>
              <span className="text-2xl font-bold">89</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sarah Johnson</span>
              <span className="text-sm font-medium">95% Fitment</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Mike Chen</span>
              <span className="text-sm font-medium">92% Fitment</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Emma Wilson</span>
              <span className="text-sm font-medium">90% Fitment</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentActivityFeed />
    </div>
  );
}
