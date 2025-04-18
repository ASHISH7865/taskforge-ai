'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Bell,
  Mail,
  Calendar,
  Clock
} from 'lucide-react'
import {
  selectBrowserNotifications,
  selectEmailNotifications,
  selectReminderNotifications,
  selectEmailAddress,
  selectNotificationTypes,
  selectQuietHours
} from '@/lib/features/settings/settings-selectors'
import {
  setBrowserNotifications,
  setEmailNotifications,
  setReminderNotifications,
  setEmailAddress,
  setNotificationType,
  setQuietHoursEnabled,
  setQuietHoursTimes
} from '@/lib/features/settings/settings-slice'

export function NotificationSettings() {
  const dispatch = useDispatch()

  // Get notification settings from Redux store
  const browserNotifications = useSelector(selectBrowserNotifications)
  const emailNotifications = useSelector(selectEmailNotifications)
  const reminderNotifications = useSelector(selectReminderNotifications)
  const emailAddress = useSelector(selectEmailAddress)
  const notificationTypes = useSelector(selectNotificationTypes)
  const quietHours = useSelector(selectQuietHours)

  // Create an array of notification type objects for rendering
  const notificationTypesList = [
    { id: 'tasks', label: 'Task reminders', checked: notificationTypes.tasks },
    { id: 'comments', label: 'Comments on your tasks', checked: notificationTypes.comments },
    { id: 'mentions', label: 'Mentions', checked: notificationTypes.mentions },
    { id: 'updates', label: 'System updates', checked: notificationTypes.updates },
  ]

  return (
    <div className="space-y-8">
      {/* General Notification Settings */}
      <div className="space-y-4">
        <Text weight="semibold">Notification Channels</Text>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Text>Browser Notifications</Text>
                <Text variant="subtle" className="text-xs">Receive notifications in your browser</Text>
              </div>
            </div>
            <Switch
              checked={browserNotifications}
              onCheckedChange={(checked) => dispatch(setBrowserNotifications(checked))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Text>Email Notifications</Text>
                <Text variant="subtle" className="text-xs">Receive email notifications</Text>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={(checked) => dispatch(setEmailNotifications(checked))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Text>Reminder Notifications</Text>
                <Text variant="subtle" className="text-xs">Receive reminders for upcoming tasks</Text>
              </div>
            </div>
            <Switch
              checked={reminderNotifications}
              onCheckedChange={(checked) => dispatch(setReminderNotifications(checked))}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Email Settings - only show if email notifications are enabled */}
      {emailNotifications && (
        <div className="space-y-4">
          <Text weight="semibold">Email Settings</Text>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={emailAddress}
              onChange={(e) => dispatch(setEmailAddress(e.target.value))}
              placeholder="your@email.com"
            />
            <Text variant="subtle" className="text-xs">We&apos;ll send notifications to this email address</Text>
          </div>
        </div>
      )}

      <Separator />

      {/* Notification Types */}
      <div className="space-y-4">
        <Text weight="semibold">Notification Types</Text>
        <Text variant="subtle">Select which types of notifications you want to receive</Text>

        <div className="grid gap-4">
          {notificationTypesList.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={type.checked}
                onCheckedChange={(checked) =>
                  dispatch(setNotificationType({
                    type: type.id as keyof typeof notificationTypes,
                    value: !!checked
                  }))
                }
              />
              <Label htmlFor={type.id}>{type.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Quiet Hours */}
      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <Text weight="semibold">Quiet Hours</Text>
            <Text variant="subtle">Don&apos;t disturb during specific hours</Text>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Text>Enable Quiet Hours</Text>
          <Switch
            checked={quietHours.enabled}
            onCheckedChange={(checked) => dispatch(setQuietHoursEnabled(checked))}
          />
        </div>

        {quietHours.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={quietHours.startTime}
                onChange={(e) => dispatch(setQuietHoursTimes({
                  startTime: e.target.value,
                  endTime: quietHours.endTime
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={quietHours.endTime}
                onChange={(e) => dispatch(setQuietHoursTimes({
                  startTime: quietHours.startTime,
                  endTime: e.target.value
                }))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
