import { FileUploadZone } from "@/components/FileUploadZone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Activity } from "lucide-react";

export default function UploadData() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Upload Data</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload job descriptions, CVs, and activity data for analysis
        </p>
      </div>

      <div className="grid gap-6">
        <FileUploadZone
          title="Job Descriptions (JDs)"
          acceptedFormats={[".pdf", ".doc", ".docx", ".txt"]}
          onFilesSelected={(files) => console.log("JD files:", files)}
        />

        <FileUploadZone
          title="Candidate CVs / Resumes"
          acceptedFormats={[".pdf", ".doc", ".docx"]}
          onFilesSelected={(files) => console.log("CV files:", files)}
        />

        <FileUploadZone
          title="Activity Data (CSV/Excel)"
          acceptedFormats={[".csv", ".xlsx", ".xls"]}
          onFilesSelected={(files) => console.log("Activity files:", files)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total JDs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">28</div>
            <p className="text-xs text-muted-foreground mt-1">Uploaded this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">342</div>
            <p className="text-xs text-muted-foreground mt-1">In database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Files</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">15</div>
            <p className="text-xs text-muted-foreground mt-1">Processed successfully</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
