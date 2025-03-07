import * as React from 'react'
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Model options
const models = [
  {
    value: 'claude-3-opus',
    label: 'Claude 3 Opus',
  },
  {
    value: 'claude-3-sonnet',
    label: 'Claude 3 Sonnet',
  },
  {
    value: 'claude-3-haiku',
    label: 'Claude 3 Haiku',
  },
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
  },
  {
    value: 'gpt-4-turbo',
    label: 'GPT-4 Turbo',
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
  },
  {
    value: 'gemini-pro',
    label: 'Gemini Pro',
  },
  {
    value: 'llama-3',
    label: 'Llama 3',
  },
]

// Create a context for model selection
export const ModelContext = React.createContext<{
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
}>({
  model: 'claude-3-opus',
  setModel: () => {},
});

export const useModel = () => React.useContext(ModelContext);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with Claude 3 Opus as default and save to localStorage
  const [model, setModel] = useState<string>(() => {
    const savedModel = localStorage.getItem('selectedModel');
    return savedModel || 'claude-3-opus';
  });
  
  // Save selected model to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedModel', model);
  }, [model]);
  
  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
};

interface ModelSelectorProps {
  variant?: 'default' | 'compact';
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ variant = 'default' }) => {
  const [open, setOpen] = useState(false)
  const { model, setModel } = useModel()
  
  // Get the formatted model name for display
  const getFormattedModelName = () => {
    return model.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  
  // Get the model short name for badge
  const getModelShortName = () => {
    const parts = model.split('-');
    return parts[parts.length - 1].toUpperCase();
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === 'default' ? (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between bg-gray-800 border-gray-700 text-gray-100"
          >
            {model ? models.find((m) => m.value === model)?.label : "Select model..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-purple-400 hover:text-purple-300 hover:bg-gray-700/50"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-gray-800 border-gray-700">
        <Command className="bg-gray-800">
          <CommandInput placeholder="Search model..." className="h-9 text-gray-100" />
          <CommandEmpty className="text-gray-400">No model found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {models.map((m) => (
              <CommandItem
                key={m.value}
                value={m.value}
                onSelect={(currentValue) => {
                  setModel(currentValue)
                  setOpen(false)
                }}
                className="text-gray-100 hover:bg-gray-700"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    model === m.value ? "opacity-100 text-purple-500" : "opacity-0"
                  )}
                />
                {m.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ModelSelector