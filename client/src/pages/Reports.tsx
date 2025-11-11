import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar } from "lucide-react";

const reports = [
  {
    id: "1",
    title: "Monthly Productivity Report",
    description: "Comprehensive productivity analysis for June 2024",
    date: "June 30, 2024",
    type: "Productivity",
    format: "PDF",
  },
  {
    id: "2",
    title: "Employee Fitment Analysis",
    description: "Detailed fitment scores and recommendations",
    date: "June 28, 2024",
    type: "Fitment",
    format: "Excel",
  },
  {
    id: "3",
    title: "Work Distribution Report",
    description: "Task allocation and utilization metrics",
    date: "June 25, 2024",
    type: "Distribution",
    format: "PDF",
  },
  {
    id: "4",
    title: "Quarterly Performance Review",
    description: "Q2 2024 performance summary",
    date: "June 30, 2024",
    type: "Performance",
    format: "PDF",
  },
  {
    id: "5",
    title: "Skill Gap Analysis",
    description: "Identifying training opportunities",
    date: "June 20, 2024",
    type: "Skills",
    format: "Excel",
  },
  {
    id: "6",
    title: "Fatigue & Wellbeing Report",
    description: "Employee workload and burnout indicators",
    date: "June 15, 2024",
    type: "Wellbeing",
    format: "PDF",
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate and download comprehensive workforce reports
          </p>
        </div>
        <Button data-testid="button-generate-report">
          <FileText className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="hover-elevate"
            data-testid={`card-report-${report.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-1">{report.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{report.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {report.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {report.format}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => console.log("Download", report.id)}
                  data-testid={`button-download-${report.id}`}
                >
                  <Download className="h-3 w-3 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
