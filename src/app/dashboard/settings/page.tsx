"use client";

import { useState } from "react";
import { User, Shield, Bell, Palette, Database, Key, Globe, Save, Loader2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { USER_ROLE } from "@/lib/constants/enums";

interface UserProfile {
  full_name: string;
  email: string;
  role: string;
  phone: string;
  avatar_url: string | null;
}

interface Settings {
  app_name: string;
  currency: string;
  timezone: string;
  date_format: string;
  default_billing_day: number;
  default_due_date: number;
  email_notifications: boolean;
  sms_notifications: boolean;
  whatsapp_notifications: boolean;
  auto_generate_rent: boolean;
  rent_reminder_days: number;
  overdue_reminder_days: number;
  language: string;
  theme: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ title: string; description: string; variant?: "default" | "destructive" } | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    full_name: "Admin User",
    email: "admin@vistar.com",
    role: "admin",
    phone: "+91 98765 43210",
    avatar_url: null,
  });

  const [settings, setSettings] = useState<Settings>({
    app_name: "VISTAR Real Estate",
    currency: "INR",
    timezone: "Asia/Kolkata",
    date_format: "DD/MM/YYYY",
    default_billing_day: 1,
    default_due_date: 5,
    email_notifications: true,
    sms_notifications: false,
    whatsapp_notifications: true,
    auto_generate_rent: true,
    rent_reminder_days: 3,
    overdue_reminder_days: 1,
    language: "en",
    theme: "light",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSave = async (type: string) => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setToast({ title: "Saved", description: `${type} settings updated successfully` });
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setToast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (passwordData.new_password.length < 6) {
      setToast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setToast({ title: "Success", description: "Password updated successfully" });
    setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
  };

  const currencies = [
    { value: "INR", label: "Indian Rupee (₹)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
  ];

  const timezones = [
    { value: "Asia/Kolkata", label: "India (UTC+5:30)" },
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (US)" },
    { value: "Europe/London", label: "London (UTC+0/+1)" },
  ];

  const dateFormats = [
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "gu", label: "Gujarati" },
  ];

  const themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  const roles = Object.entries(USER_ROLE).map(([key, label]) => ({ value: key, label }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account and application preferences</p>
        </div>
        <Button onClick={() => handleSave("All")} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save All Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="rent" className="gap-2">
            <Database className="h-4 w-4" />
            Rent Settings
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {profile.full_name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full">
                      Change Avatar
                    </Button>
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setProfile(p => ({ ...p, avatar_url: reader.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button variant="ghost" className="text-red-600 hover:text-red-700 w-full">
                    Remove Avatar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="role">Role</Label>
                    <Select value={profile.role} onValueChange={(v) => { if (v) setProfile(p => ({ ...p, role: v })); }} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Role cannot be changed</p>
                  </div>
                </div>
                <Button onClick={() => handleSave("Profile")} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="app_name">Application Name</Label>
                  <Input
                    id="app_name"
                    value={settings.app_name}
                    onChange={(e) => setSettings(s => ({ ...s, app_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={settings.currency} onValueChange={(v) => { if (v) setSettings(s => ({ ...s, currency: v })); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(v) => { if (v) setSettings(s => ({ ...s, timezone: v })); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="date_format">Date Format</Label>
                  <Select value={settings.date_format} onValueChange={(v) => { if (v) setSettings(s => ({ ...s, date_format: v })); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateFormats.map(d => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(v) => { if (v) setSettings(s => ({ ...s, language: v })); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(l => (
                        <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSave("General")} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save General Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Channels</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { key: "email_notifications", label: "Email", icon: "📧", desc: "Receive notifications via email" },
                    { key: "sms_notifications", label: "SMS", icon: "📱", desc: "Receive notifications via SMS" },
                    { key: "whatsapp_notifications", label: "WhatsApp", icon: "💬", desc: "Receive notifications via WhatsApp" },
                  ].map(item => (
                    <div key={item.key} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings[item.key as keyof Settings] as boolean}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, [item.key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Rent Reminders</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="rent_reminder_days">Rent Reminder (Days Before Due)</Label>
                    <Input
                      id="rent_reminder_days"
                      type="number"
                      value={settings.rent_reminder_days}
                      onChange={(e) => setSettings(s => ({ ...s, rent_reminder_days: Number(e.target.value) }))}
                      min="0"
                      max="30"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="overdue_reminder_days">Overdue Reminder (Days After Due)</Label>
                    <Input
                      id="overdue_reminder_days"
                      type="number"
                      value={settings.overdue_reminder_days}
                      onChange={(e) => setSettings(s => ({ ...s, overdue_reminder_days: Number(e.target.value) }))}
                      min="0"
                      max="30"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Notifications")} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rent Settings Tab */}
        <TabsContent value="rent">
          <Card>
            <CardHeader>
              <CardTitle>Rent Configuration</CardTitle>
              <CardDescription>Default settings for rent generation and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="default_billing_day">Default Billing Day</Label>
                  <Select value={settings.default_billing_day} onValueChange={(v) => setSettings(s => ({ ...s, default_billing_day: Number(v) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>{day}{day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Day of month when rent is generated</p>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="default_due_date">Default Due Date</Label>
                  <Select value={settings.default_due_date} onValueChange={(v) => setSettings(s => ({ ...s, default_due_date: Number(v) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>{day}{day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Day of month when rent payment is due</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-generate Monthly Rent</p>
                  <p className="text-sm text-gray-500">Automatically create rent records for active contracts</p>
                </div>
                <Switch
                  checked={settings.auto_generate_rent}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, auto_generate_rent: checked }))}
                />
              </div>

              <Button onClick={() => handleSave("Rent Settings")} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Rent Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid gap-4 md:grid-cols-3">
                  {themes.map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => setSettings(s => ({ ...s, theme: theme.value }))}
                      className={cn(
                        "p-4 border-2 rounded-lg text-left transition-all",
                        settings.theme === theme.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <p className="font-medium capitalize">{theme.label}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {theme.value === "light" && "Always use light mode"}
                        {theme.value === "dark" && "Always use dark mode"}
                        {theme.value === "system" && "Follow system preference"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Preview</h3>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm font-bold">V</div>
                    <div>
                      <p className="font-medium">{settings.app_name}</p>
                      <p className="text-sm text-gray-500">Dashboard preview</p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="p-3 bg-white rounded border">
                      <p className="text-xs text-gray-500">Primary Color</p>
                      <div className="w-full h-6 bg-primary rounded" />
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-xs text-gray-500">Background</p>
                      <div className="w-full h-6 bg-gray-50 rounded border" />
                    </div>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-xs text-gray-500">Card</p>
                      <div className="w-full h-6 bg-white rounded border" />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Appearance")} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Appearance Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="current_password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData(p => ({ ...p, current_password: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(p => ({ ...p, new_password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input
                      id="confirm_password"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(p => ({ ...p, confirm_password: e.target.value }))}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Password must be at least 6 characters</p>
                <Button onClick={handlePasswordChange} disabled={saving} variant="default">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Session Management</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active Sessions</p>
                    <p className="text-sm text-gray-500">View and manage your active login sessions</p>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Danger Zone</h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-700">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
          <div className={cn(
            "px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]",
            toast.variant === "destructive" ? "bg-red-600 text-white" : "bg-green-600 text-white"
          )}>
            <div>
              <p className="font-medium">{toast.title}</p>
              <p className="text-sm opacity-90">{toast.description}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:text-gray-200" onClick={() => setToast(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}