import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Admin User" data-testid="input-name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="admin@workforce.ai"
              data-testid="input-email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Administrator" disabled />
          </div>
          <Button data-testid="button-save-profile">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              data-testid="input-current-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" data-testid="input-new-password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              data-testid="input-confirm-password"
            />
          </div>
          <Button data-testid="button-update-password">Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about system activity
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-email-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fatigue Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when employees show burnout indicators
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-fatigue-alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Receive weekly summary reports via email
              </p>
            </div>
            <Switch data-testid="switch-weekly-reports" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" data-testid="button-export-data">
            Export My Data
          </Button>
          <p className="text-sm text-muted-foreground">
            Download all your data in a machine-readable format
          </p>
          <Separator />
          <Button variant="destructive" data-testid="button-delete-account">
            Delete Account
          </Button>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
