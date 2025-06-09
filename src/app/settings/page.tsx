
"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';
import { Settings as SettingsIcon, Palette, Bell, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Placeholder state for notification settings
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);

  const handleSaveChanges = () => {
    // In a real app, you would save these settings to a backend or localStorage
    console.log("Settings saved (simulated):", { theme, emailNotifications, pushNotifications });
    toast({
      title: "Settings Saved",
      description: "Your application settings have been updated (simulated).",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Settings</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Manage your application preferences.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Appearance Settings Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-headline">Appearance</CardTitle>
              </div>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-2 block">Theme</Label>
                <RadioGroup
                  value={theme}
                  onValueChange={(value) => setTheme(value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light" className="font-normal">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark" className="font-normal">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system" className="font-normal">System Default</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-headline">Notifications</CardTitle>
              </div>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
                <Label htmlFor="email-notifications" className="font-medium flex-1 cursor-pointer">
                  Email Notifications
                  <p className="text-xs text-muted-foreground font-normal">Receive updates and alerts via email.</p>
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  aria-label="Toggle email notifications"
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
                <Label htmlFor="push-notifications" className="font-medium flex-1 cursor-pointer">
                  Push Notifications
                  <p className="text-xs text-muted-foreground font-normal">Get real-time alerts directly on your device.</p>
                </Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  aria-label="Toggle push notifications"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account/Privacy Settings Card (Placeholder) */}
           <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-headline">Account & Privacy</CardTitle>
              </div>
              <CardDescription>Manage your account security and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Account and privacy settings options would go here (e.g., change password, manage data, etc.). This section is a placeholder for future development.
              </p>
               <Button variant="outline" className="mt-4">Manage Account Data</Button>
            </CardContent>
          </Card>

        </div>
        <div className="max-w-4xl mx-auto mt-8 flex justify-end">
          <Button onClick={handleSaveChanges} size="lg">Save All Settings</Button>
        </div>
      </div>
    </AppLayout>
  );
}
