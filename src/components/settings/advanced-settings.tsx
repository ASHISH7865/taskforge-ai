'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Zap,
  Code,
  Terminal,
  Cpu,
  RefreshCw
} from 'lucide-react'
import {
  selectDevMode,
  selectApiEndpoint,
  selectConsoleLogging,
  selectHardwareAcceleration,
  selectCacheStrategy,
  selectAnimationSpeed
} from '@/lib/features/settings/settings-selectors'
import {
  setDevMode,
  setApiEndpoint,
  setConsoleLogging,
  setHardwareAcceleration,
  setCacheStrategy,
  setAnimationSpeed,
  CacheStrategy
} from '@/lib/features/settings/settings-slice'

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

// Cache strategy options data
const cacheModes = [
  {
    value: 'performance',
    label: 'Performance',
    description: 'Aggressively cache data for best performance'
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Balance between fresh data and performance'
  },
  {
    value: 'fresh',
    label: 'Always Fresh',
    description: 'Always fetch the latest data'
  }
]

// Animation speed presets
const speedPresets = [
  { value: '0.5', label: '0.5x' },
  { value: '0.75', label: '0.75x' },
  { value: '1', label: '1x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' }
]

export function AdvancedSettings() {
  const dispatch = useDispatch()

  // Get developer settings from Redux store
  const devMode = useSelector(selectDevMode)
  const apiEndpoint = useSelector(selectApiEndpoint)
  const consoleLogging = useSelector(selectConsoleLogging)

  // Get performance settings from Redux store
  const hardwareAcceleration = useSelector(selectHardwareAcceleration)
  const cacheStrategy = useSelector(selectCacheStrategy)
  const animationSpeed = useSelector(selectAnimationSpeed)

  return (
    <div className="space-y-8">
      {/* Performance Settings */}
      <SettingsSection
        title="Performance"
        description="Customize performance-related settings"
        icon={<Zap className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Text>Hardware Acceleration</Text>
              <Text variant="subtle" className="text-xs">Use GPU for rendering when available</Text>
            </div>
            <Switch
              checked={hardwareAcceleration}
              onCheckedChange={(checked) => dispatch(setHardwareAcceleration(checked))}
            />
          </div>

          <div className="space-y-2">
            <Text>Cache Strategy</Text>
            <RadioGroup
              value={cacheStrategy}
              onValueChange={(value) => dispatch(setCacheStrategy(value as CacheStrategy))}
              className="space-y-3"
            >
              {cacheModes.map(mode => (
                <div key={mode.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={mode.value} id={mode.value} />
                  <Label htmlFor={mode.value} className="flex flex-col">
                    <span>{mode.label}</span>
                    <span className="text-xs text-muted-foreground">{mode.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="animation-speed">Animation Speed</Label>
              <Text className="font-mono text-xs">{animationSpeed}x</Text>
            </div>
            <div className="grid grid-cols-[1fr_80px] gap-2">
              <Input
                id="animation-speed"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={animationSpeed}
                onChange={(e) => dispatch(setAnimationSpeed(parseFloat(e.target.value)))}
                className="cursor-pointer"
              />
              <Select
                value={animationSpeed.toString()}
                onValueChange={(value) => dispatch(setAnimationSpeed(parseFloat(value)))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {speedPresets.map(preset => (
                    <SelectItem key={preset.value} value={preset.value}>{preset.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </SettingsSection>

      <Separator />

      {/* Developer Options */}
      <SettingsSection
        title="Developer Options"
        description="Advanced settings for developers"
        icon={<Code className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Text>Developer Mode</Text>
              <Text variant="subtle" className="text-xs">Enable advanced features and debugging tools</Text>
            </div>
            <Switch
              checked={devMode}
              onCheckedChange={(checked) => dispatch(setDevMode(checked))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-endpoint">API Endpoint</Label>
            <Input
              id="api-endpoint"
              value={apiEndpoint}
              onChange={(e) => dispatch(setApiEndpoint(e.target.value))}
              placeholder="https://api.example.com"
            />
            <Text variant="subtle" className="text-xs">Custom API endpoint for development and testing</Text>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Text>Console Logging</Text>
              <Text variant="subtle" className="text-xs">Log detailed information to browser console</Text>
            </div>
            <Switch
              checked={consoleLogging}
              onCheckedChange={(checked) => dispatch(setConsoleLogging(checked))}
            />
          </div>
        </div>
      </SettingsSection>

      {devMode && (
        <>
          <Separator />

          {/* Terminal Access - only shown in dev mode */}
          <SettingsSection
            title="Terminal Access"
            description="Access to command-line interface"
            icon={<Terminal className="h-5 w-5 text-muted-foreground" />}
          >
            <div className="p-4 bg-secondary rounded-md">
              <Text variant="mono" className="text-sm">
                Type commands here...
              </Text>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button size="sm">
                Run Command
              </Button>
            </div>
          </SettingsSection>

          <Separator />

          {/* System Info - only shown in dev mode */}
          <SettingsSection
            title="System Information"
            icon={<Cpu className="h-5 w-5 text-muted-foreground" />}
          >
            <div className="grid grid-cols-2 gap-y-2 text-sm bg-secondary/50 p-4 rounded-md">
              <Text variant="subtle">Browser:</Text>
              <Text>Chrome 108.0.5359.125</Text>
              <Text variant="subtle">OS:</Text>
              <Text>Windows 11</Text>
              <Text variant="subtle">Memory Usage:</Text>
              <Text>128 MB</Text>
              <Text variant="subtle">Rendering Engine:</Text>
              <Text>WebKit</Text>
            </div>
          </SettingsSection>
        </>
      )}
    </div>
  )
}
