'use client'

import { useState } from 'react'
import { Heading, Text } from "@/components/ui/typography"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppearanceSettings } from '@/components/settings/appearance-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { DataSettings } from '@/components/settings/data-settings'
import { AdvancedSettings } from '@/components/settings/advanced-settings'
import { Palette, Bell, Database, Cog } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance')

  return (
    <div className="container max-w-screen-xl mx-auto py-6 space-y-8">
      <div className="space-y-1">
        <Heading variant="h1">Settings</Heading>
        <Text variant="lead" className="text-muted-foreground">
          Customize your MinimalMind experience
        </Text>
      </div>

      <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-4xl">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your data, backups, and exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced configuration options for power users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
