import { useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useBluetooth } from "@/hooks/useBluetooth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Download } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [showDebug, setShowDebug] = useState(false);
  const { t, currentLanguage, setLanguage } = useI18n();
  const { isBluetoothSupported, debugLogs } = useBluetooth();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文 (简体)' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  const handleExportLogs = () => {
    const logs = debugLogs.join('\n');
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ble-controller-logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTitleLongPress = () => {
    setShowDebug(!showDebug);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle 
            className="flex items-center justify-between select-none"
            onTouchStart={() => {
              setTimeout(handleTitleLongPress, 3000);
            }}
          >
            <span>{t('settings.title')}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {t('settings.language')}
            </Label>
            <RadioGroup value={currentLanguage} onValueChange={handleLanguageChange}>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.code} className="flex items-center space-x-3">
                    <RadioGroupItem value={lang.code} id={lang.code} />
                    <Label htmlFor={lang.code} className="text-sm cursor-pointer">
                      {lang.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* About Section */}
          <div>
            <h4 className="text-sm font-medium mb-2">{t('settings.about')}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Version: <span className="text-foreground">1.0.0</span></div>
              <div>Build: <span className="text-foreground">2024.01.15</span></div>
              <div>
                Web Bluetooth: <span className={isBluetoothSupported ? 'text-green-400' : 'text-red-400'}>
                  {isBluetoothSupported ? t('common.supported') : t('common.notSupported')}
                </span>
              </div>
              <div>Mode: <span className="text-foreground">
                {isBluetoothSupported ? 'Real Device' : 'Simulation'}
              </span></div>
            </div>
          </div>

          {/* Debug Information (Hidden by default) */}
          {showDebug && (
            <div>
              <h4 className="text-sm font-medium mb-2">{t('settings.debug')}</h4>
              <div className="bg-background border border-border rounded-lg p-3 text-xs font-mono text-muted-foreground max-h-32 overflow-y-auto">
                {debugLogs.length > 0 ? (
                  debugLogs.slice(-10).map((log, index) => (
                    <div key={index}>{log}</div>
                  ))
                ) : (
                  <div>No debug logs available</div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-border hover:border-primary"
              onClick={handleExportLogs}
            >
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>{t('settings.exportLogs')}</span>
              </div>
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {t('common.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
