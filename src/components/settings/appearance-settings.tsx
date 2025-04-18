'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Text } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  Sun,
  Moon,
  Monitor,
  Laptop,
  Maximize,
  Minimize
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  selectThemeMode,
  selectUIDensity,
  selectFontSize,
  selectAnimationsEnabled
} from '@/lib/features/settings/settings-selectors'
import {
  setThemeMode,
  setUIDensity,
  setFontSize,
  setAnimationsEnabled,
  resetAppearanceSettings,
  ThemeMode,
  UIDensity
} from '@/lib/features/settings/settings-slice'
import { Button } from '@/components/ui/button'

// Theme option data for rendering theme selector
const themeOptions = [
  { value: 'light', label: 'Light', description: 'Light background with dark text', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Dark background with light text', icon: Moon },
  { value: 'system', label: 'System', description: "Follow your system's theme", icon: Monitor }
]

// Density option data for rendering density selector
const densityOptions = [
  { value: 'compact', label: 'Compact', description: 'Reduced spacing for more content', icon: Minimize },
  { value: 'default', label: 'Default', description: 'Standard spacing and layout', icon: Laptop },
  { value: 'comfortable', label: 'Comfortable', description: 'More space between elements', icon: Maximize }
]

// Section component for consistent layout
const SettingsSection = ({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode
}) => (
  <div className="space-y-4">
    <div>
      <Text weight="semibold">{title}</Text>
      {description && <Text variant="subtle">{description}</Text>}
    </div>
    {children}
  </div>
)

export function AppearanceSettings() {
  const dispatch = useDispatch()

  // Get all settings from Redux store
  const theme = useSelector(selectThemeMode)
  const uiDensity = useSelector(selectUIDensity)
  const fontSize = useSelector(selectFontSize)
  const animationsEnabled = useSelector(selectAnimationsEnabled)

  // Handler functions for updating settings
  const handleThemeChange = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode))
  }

  const handleUIDensityChange = (density: UIDensity) => {
    dispatch(setUIDensity(density))
  }

  const handleFontSizeChange = (value: number[]) => {
    dispatch(setFontSize(value[0]))
  }

  const handleAnimationsToggle = (enabled: boolean) => {
    dispatch(setAnimationsEnabled(enabled))
  }

  const handleResetSettings = () => {
    dispatch(resetAppearanceSettings())
  }

  return (
    <div className="space-y-8">
      {/* Theme Section */}
      <SettingsSection
        title="Theme Mode"
        description="Choose your preferred theme mode"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {themeOptions.map(option => (
            <div
              key={option.value}
              className={cn(
                "flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
                theme === option.value ? "border-primary bg-primary/5" : "border-border"
              )}
              onClick={() => handleThemeChange(option.value as ThemeMode)}
            >
              <option.icon className="h-5 w-5" />
              <div className="ml-2">
                <Text>{option.label}</Text>
                <Text variant="subtle" className="text-xs">{option.description}</Text>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      <Separator />

      {/* UI Density Section - Enhanced */}
      <SettingsSection
        title="UI Density"
        description="Adjust how compact the user interface appears"
      >
        <div className="mb-4">
          <Text variant="subtle">
            Density affects spacing, padding, and component sizes throughout the app.
            Try different options to find what works best for your screen size.
          </Text>
        </div>
        <RadioGroup
          value={uiDensity}
          onValueChange={handleUIDensityChange}
          className="flex flex-col md:flex-row gap-4"
        >
          {densityOptions.map(option => (
            <div
              key={option.value}
              className={cn(
                "flex-1 flex items-center gap-2 p-4 rounded-lg cursor-pointer border-2 transition-all",
                uiDensity === option.value ? "border-primary bg-primary/5" : "border-border"
              )}
            >
              <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
              <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                <option.icon className="h-5 w-5" />
                <div>
                  <Text>{option.label}</Text>
                  <Text variant="subtle" className="text-xs">{option.description}</Text>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Visual demonstration of selected density */}
        <div className={cn(
          "mt-4 p-4 rounded-lg border bg-secondary/20",
          uiDensity === 'compact' ? "p-2 space-y-2" :
          uiDensity === 'comfortable' ? "p-6 space-y-6" : "p-4 space-y-4"
        )}>
          <Text weight="semibold">Density Preview</Text>
          <div className={cn(
            "flex items-center gap-2",
            uiDensity === 'compact' ? "gap-1" :
            uiDensity === 'comfortable' ? "gap-3" : "gap-2"
          )}>
            <div className={cn(
              "w-4 h-4 bg-primary rounded-full",
              uiDensity === 'compact' ? "w-3 h-3" :
              uiDensity === 'comfortable' ? "w-5 h-5" : "w-4 h-4"
            )}></div>
            <Text>Sample element</Text>
          </div>
          <div className={cn(
            "grid grid-cols-3 gap-2",
            uiDensity === 'compact' ? "gap-1" :
            uiDensity === 'comfortable' ? "gap-3" : "gap-2"
          )}>
            <div className="bg-muted p-2 rounded">Item 1</div>
            <div className="bg-muted p-2 rounded">Item 2</div>
            <div className="bg-muted p-2 rounded">Item 3</div>
          </div>
        </div>
      </SettingsSection>

      <Separator />

      {/* Font Size Section */}
      <SettingsSection
        title="Font Size"
        description="Adjust the base font size"
      >
        <div className="flex justify-between items-center mb-2">
          <Text variant="subtle">Current size</Text>
          <Text className="font-mono">{fontSize}px</Text>
        </div>

        <div className="py-2">
          <Slider
            value={[fontSize]}
            min={12}
            max={20}
            step={1}
            onValueChange={handleFontSizeChange}
          />
          <div className="flex justify-between mt-2">
            <Text variant="subtle" className="text-xs">Small (12px)</Text>
            <Text variant="subtle" className="text-xs">Large (20px)</Text>
          </div>
        </div>
      </SettingsSection>

      <Separator />

      {/* Additional Settings */}
      <SettingsSection title="Additional Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Text>Animations</Text>
              <Text variant="subtle" className="text-xs">Enable interface animations</Text>
            </div>
            <Switch
              checked={animationsEnabled}
              onCheckedChange={handleAnimationsToggle}
            />
          </div>
        </div>
      </SettingsSection>

      <Separator />

      {/* Reset Settings Section */}
      <div className="pt-2">
        <Button
          variant="outline"
          onClick={handleResetSettings}
          className="w-full sm:w-auto"
        >
          Reset Appearance Settings
        </Button>
        <Text variant="subtle" className="text-xs mt-2">
          This will reset all appearance settings to their default values
        </Text>
      </div>
    </div>
  )
}
