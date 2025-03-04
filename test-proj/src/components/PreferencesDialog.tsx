import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Check, Moon, Sun, Zap } from 'lucide-react'

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreferencesDialog: React.FC<PreferencesDialogProps> = ({ open, onOpenChange }) => {
  // Theme preferences
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [desktopNotifications, setDesktopNotifications] = useState<boolean>(true);
  
  // Privacy preferences
  const [saveHistory, setSaveHistory] = useState<boolean>(true);
  const [shareAnalytics, setShareAnalytics] = useState<boolean>(true);
  
  // Performance preferences
  const [lowLatencyMode, setLowLatencyMode] = useState<boolean>(false);
  const [generateShorterResponses, setGenerateShorterResponses] = useState<boolean>(false);
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("appearance");

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate saving preferences
    setTimeout(() => {
      // Save preferences to localStorage
      const preferences = {
        appearance: {
          darkMode,
          reduceMotion,
          highContrast
        },
        notifications: {
          emailNotifications,
          soundEnabled,
          desktopNotifications
        },
        privacy: {
          saveHistory,
          shareAnalytics
        },
        performance: {
          lowLatencyMode,
          generateShorterResponses
        }
      };
      
      localStorage.setItem('user_preferences', JSON.stringify(preferences));
      
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after delay
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  React.useEffect(() => {
    // Load saved preferences from localStorage
    try {
      const savedPreferences = localStorage.getItem('user_preferences');
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        
        // Appearance
        if (preferences.appearance) {
          setDarkMode(preferences.appearance.darkMode ?? true);
          setReduceMotion(preferences.appearance.reduceMotion ?? false);
          setHighContrast(preferences.appearance.highContrast ?? false);
        }
        
        // Notifications
        if (preferences.notifications) {
          setEmailNotifications(preferences.notifications.emailNotifications ?? true);
          setSoundEnabled(preferences.notifications.soundEnabled ?? true);
          setDesktopNotifications(preferences.notifications.desktopNotifications ?? true);
        }
        
        // Privacy
        if (preferences.privacy) {
          setSaveHistory(preferences.privacy.saveHistory ?? true);
          setShareAnalytics(preferences.privacy.shareAnalytics ?? true);
        }
        
        // Performance
        if (preferences.performance) {
          setLowLatencyMode(preferences.performance.lowLatencyMode ?? false);
          setGenerateShorterResponses(preferences.performance.generateShorterResponses ?? false);
        }
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Preferences</DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize your application settings and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-4 bg-gray-700 border border-gray-600">
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-100"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-100"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-100"
            >
              Privacy
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-100"
            >
              Performance
            </TabsTrigger>
          </TabsList>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Dark Mode</Label>
                <div className="text-xs text-gray-400">Enable dark theme for the application</div>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Reduce Motion</Label>
                <div className="text-xs text-gray-400">Minimize animations throughout the app</div>
              </div>
              <Switch 
                checked={reduceMotion} 
                onCheckedChange={setReduceMotion} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">High Contrast</Label>
                <div className="text-xs text-gray-400">Increase contrast for better readability</div>
              </div>
              <Switch 
                checked={highContrast} 
                onCheckedChange={setHighContrast} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Email Notifications</Label>
                <div className="text-xs text-gray-400">Receive important updates via email</div>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Sound Effects</Label>
                <div className="text-xs text-gray-400">Enable sounds for notifications and actions</div>
              </div>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Desktop Notifications</Label>
                <div className="text-xs text-gray-400">Show desktop notifications for new messages</div>
              </div>
              <Switch 
                checked={desktopNotifications} 
                onCheckedChange={setDesktopNotifications} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Save Chat History</Label>
                <div className="text-xs text-gray-400">Store conversation history in your account</div>
              </div>
              <Switch 
                checked={saveHistory} 
                onCheckedChange={setSaveHistory} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Share Analytics</Label>
                <div className="text-xs text-gray-400">Help improve the app by sharing anonymous usage data</div>
              </div>
              <Switch 
                checked={shareAnalytics} 
                onCheckedChange={setShareAnalytics} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Low Latency Mode</Label>
                <div className="text-xs text-gray-400">Optimize for faster response times</div>
              </div>
              <Switch 
                checked={lowLatencyMode} 
                onCheckedChange={setLowLatencyMode} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-200">Generate Shorter Responses</Label>
                <div className="text-xs text-gray-400">AI will provide more concise answers</div>
              </div>
              <Switch 
                checked={generateShorterResponses} 
                onCheckedChange={setGenerateShorterResponses} 
                className="data-[state=checked]:bg-purple-700"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          {saveSuccess && (
            <div className="mr-auto flex items-center text-green-400">
              <Check className="mr-2 h-4 w-4" />
              <span>Preferences saved!</span>
            </div>
          )}
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-purple-700 hover:bg-purple-600"
          >
            {isSaving ? "Saving..." : "Save preferences"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PreferencesDialog