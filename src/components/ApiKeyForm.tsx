
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const localStorageKey = 'copycat-cuisine-api-key';

export const getApiKey = (): string | null => {
  return localStorage.getItem(localStorageKey);
};

export const saveApiKey = (key: string): void => {
  localStorage.setItem(localStorageKey, key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(localStorageKey);
};

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setHasKey(true);
    }
  }, []);

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsValidating(true);

    try {
      // In a real implementation, this would validate the API key with OpenAI
      // For now, we'll just check that it matches the expected format
      const isValidFormat = apiKey.startsWith('sk-') && apiKey.length > 20;
      
      if (isValidFormat) {
        saveApiKey(apiKey);
        setHasKey(true);
        toast.success('API key saved successfully');
      } else {
        toast.error('Invalid API key format', {
          description: 'API key should start with "sk-" and be at least 20 characters long'
        });
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      toast.error('Failed to validate API key');
    } finally {
      setIsValidating(false);
    }
  };

  const clearSavedApiKey = () => {
    clearApiKey();
    setApiKey('');
    setHasKey(false);
    toast.success('API key removed');
  };

  return (
    <div className="p-6 bg-white/90 backdrop-blur-md border border-culinary-beige rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Key size={20} className="text-culinary-copper" />
        <h2 className="text-xl font-display font-medium">ChatGPT API Key</h2>
      </div>
      
      {hasKey ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <Check size={18} />
            <span className="text-sm">API key is set and ready to use</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type={showKey ? "text" : "password"}
              value={apiKey}
              disabled
              className="flex-1 bg-muted"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? "Hide" : "Show"}
            </Button>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearSavedApiKey}
          >
            Remove API Key
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg">
            <AlertTriangle size={18} />
            <span className="text-sm">
              Enter your OpenAI API key to enable actual recipe generation with ChatGPT
            </span>
          </div>
          
          <div className="space-y-2">
            <Input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full"
            />
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? "Hide" : "Show"}
              </Button>
              <Button
                onClick={validateAndSaveApiKey}
                disabled={isValidating || !apiKey.trim()}
              >
                {isValidating ? "Validating..." : "Save API Key"}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Your API key is stored locally in your browser and never sent to our servers.</p>
        <p className="mt-1">
          Without an API key, the extension will use simulated responses for a limited set of recipes.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyForm;
