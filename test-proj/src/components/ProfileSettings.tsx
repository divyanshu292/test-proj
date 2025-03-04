import * as React from 'react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatars'
import { Badge } from '@/components/ui/badge'
import { Check, UserIcon, X } from 'lucide-react'

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ open, onOpenChange }) => {
  const { currentUser, updateUser } = useAuth()
  
  const [name, setName] = useState<string>(currentUser?.name || '')
  const [email, setEmail] = useState<string>(currentUser?.email || '')
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.picture || '')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call to update user info
    setTimeout(() => {
      if (updateUser) {
        updateUser({
          ...currentUser,
          name,
          email,
          picture: avatarUrl
        });
      }
      
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Profile Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your profile information and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-20 w-20 border-2 border-purple-500">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : (
              <AvatarFallback className="bg-purple-800 text-purple-100 font-bold text-xl">
                {name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          
          <Badge variant="purple">Pro User</Badge>
        </div>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right text-gray-300">
              Avatar URL
            </Label>
            <Input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>
        
        <DialogFooter>
          {saveSuccess && (
            <div className="mr-auto flex items-center text-green-400">
              <Check className="mr-2 h-4 w-4" />
              <span>Saved successfully!</span>
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
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileSettings