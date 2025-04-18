'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Download,
  Upload,
  Trash2,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  Check,
  Database,
  Save
} from 'lucide-react'
import { resetAllSettings } from '@/lib/features/settings/settings-slice'

// Section component for consistent layout
const SettingsSection = ({
  title,
  description,
  children,
  icon
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="space-y-4">
    <div className="flex gap-2 items-center">
      {icon}
      <div>
        <Text weight="semibold">{title}</Text>
        {description && <Text variant="subtle">{description}</Text>}
      </div>
    </div>
    {children}
  </div>
)

export function DataSettings() {
  const dispatch = useDispatch()
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [lastBackup, setLastBackup] = useState('Never')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const storageUsed = 1.2 // GB
  const storageLimit = 5 // GB

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const next = prev + 10
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsExporting(false)
            setLastBackup('Just now')
          }, 500)
          return 100
        }
        return next
      })
    }, 300)
  }

  const handleResetSettings = () => {
    dispatch(resetAllSettings())
    setShowResetConfirm(false)
  }

  const handleDeleteData = () => {
    // Here you would implement actual data deletion logic
    setShowDeleteConfirm(false)
  }

  const storagePercentage = (storageUsed / storageLimit) * 100

  return (
    <div className="space-y-8">
      {/* Storage Usage */}
      <SettingsSection
        title="Storage Usage"
        icon={<HardDrive className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="flex justify-between items-center mb-2">
          <Text className="text-sm text-muted-foreground">{storageUsed} GB of {storageLimit} GB</Text>
          <Text className="text-sm text-muted-foreground">{storagePercentage.toFixed(0)}%</Text>
        </div>

        <Progress value={storagePercentage} className="h-2" />

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>0 GB</span>
          <span>{storageLimit} GB</span>
        </div>
      </SettingsSection>

      <Separator />

      {/* Backup & Restore */}
      <SettingsSection
        title="Backup & Restore"
        description="Backup your data or restore from a previous backup"
        icon={<Save className="h-5 w-5 text-muted-foreground" />}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Data Backup</CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <Text>Last backup</Text>
                <Text variant="subtle" className="text-xs">{lastBackup}</Text>
              </div>
              {lastBackup !== 'Never' && (
                <div className="flex items-center text-green-600 dark:text-green-500 gap-1 text-sm">
                  <Check className="h-4 w-4" />
                  <span>Backup ready</span>
                </div>
              )}
            </div>

            {isExporting && (
              <div className="my-4 space-y-2">
                <Text variant="subtle" className="text-sm">Exporting data...</Text>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="default"
              onClick={handleExport}
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          </CardFooter>
        </Card>
      </SettingsSection>

      <Separator />

      {/* Data Retention */}
      <SettingsSection
        title="Data Retention"
        description="Control how long your data is stored"
        icon={<Database className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <Text>Clear Cached Data</Text>
              <Text variant="subtle" className="text-xs">
                Clears temporary files and cached data
              </Text>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Cache
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Text>Reset Application</Text>
              <Text variant="subtle" className="text-xs">
                Reset application to default settings
              </Text>
            </CardContent>
            <CardFooter>
              <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset App
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Settings</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reset all settings to default values? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowResetConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleResetSettings}
                    >
                      Reset All Settings
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </SettingsSection>

      <Separator />

      {/* Danger Zone */}
      <SettingsSection
        title="Danger Zone"
        icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
      >
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            These actions are irreversible and will permanently delete your data.
          </AlertDescription>
        </Alert>

        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-4">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete All Data</DialogTitle>
              <DialogDescription>
                This will permanently delete all your data. This action cannot be undone. Are you sure you want to proceed?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteData}
              >
                Delete All Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SettingsSection>
    </div>
  )
}
