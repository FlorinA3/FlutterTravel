import { useState, useEffect } from "react";
import { Device, SessionLog } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { useBluetooth } from "@/hooks/useBluetooth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square, Calendar, Wifi } from "lucide-react";

interface DeviceControlModalProps {
  device: Device;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: () => void;
}

export default function DeviceControlModal({
  device,
  isOpen,
  onClose,
  onSchedule,
}: DeviceControlModalProps) {
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high' | 'max'>('low');
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const { t } = useI18n();
  const { addLog } = useIndexedDB();
  const { sendCommand } = useBluetooth();

  useEffect(() => {
    setRemainingTime(duration);
  }, [duration]);

  useEffect(() => {
    if (isRunning && !isPaused && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [isRunning, isPaused, remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    const confirmed = window.confirm(t('control.confirmStart'));
    if (!confirmed) return;

    try {
      await sendCommand(device.id, 'start', { intensity, duration });
      setIsRunning(true);
      setIsPaused(false);
    } catch (error) {
      alert(t('errors.connectionFailed'));
    }
  };

  const handleResume = async () => {
    try {
      await sendCommand(device.id, 'start', { intensity, duration: remainingTime });
      setIsPaused(false);
    } catch (error) {
      alert(t('errors.connectionFailed'));
    }
  };

  const handlePause = async () => {
    try {
      await sendCommand(device.id, 'pause');
      setIsPaused(true);
    } catch (error) {
      alert(t('errors.connectionFailed'));
    }
  };

  const handleStop = async () => {
    const confirmed = window.confirm(t('control.confirmStop'));
    if (!confirmed) return;

    try {
      await sendCommand(device.id, 'stop');
      setIsRunning(false);
      setIsPaused(false);
      
      // Log as stopped
      const log: SessionLog = {
        id: crypto.randomUUID(),
        deviceId: device.id,
        deviceName: device.name,
        intensity,
        duration: duration - remainingTime,
        outcome: 'stopped',
        timestamp: new Date().toISOString(),
      };
      await addLog(log);
      
      setRemainingTime(duration);
    } catch (error) {
      alert(t('errors.connectionFailed'));
    }
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    setIsPaused(false);
    
    // Log as success
    const log: SessionLog = {
      id: crypto.randomUUID(),
      deviceId: device.id,
      deviceName: device.name,
      intensity,
      duration,
      outcome: 'success',
      timestamp: new Date().toISOString(),
    };
    await addLog(log);
    
    console.log('Session completed successfully');
  };

  const intensityButtons = [
    { value: 'low' as const, label: t('intensity.low') },
    { value: 'medium' as const, label: t('intensity.medium') },
    { value: 'high' as const, label: t('intensity.high') },
    { value: 'max' as const, label: t('intensity.max') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className={`status-indicator ${device.connected ? 'status-connected' : 'status-disconnected'}`} />
              <span>{device.name}</span>
            </div>
            <Wifi className="w-5 h-5 text-primary" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="timer-display">{formatTime(remainingTime)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t('control.remaining')}
            </div>
          </div>

          {/* Intensity Selector */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {t('control.intensity')}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {intensityButtons.map((button) => (
                <Button
                  key={button.value}
                  variant={intensity === button.value ? "default" : "outline"}
                  className={`control-button ${intensity === button.value ? 'intensity-button active' : 'intensity-button'}`}
                  onClick={() => setIntensity(button.value)}
                  disabled={isRunning}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Timer Input */}
          <div>
            <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
              {t('control.duration')}
            </Label>
            <Input
              id="duration"
              type="number"
              min="5"
              max="7200"
              value={duration}
              onChange={(e) => setDuration(Math.max(5, Math.min(7200, parseInt(e.target.value) || 5)))}
              disabled={isRunning}
              className="bg-background border-border"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {t('control.durationHelp')}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={isPaused ? handleResume : handleStart}
              disabled={isRunning && !isPaused || !device.connected}
              className="bg-green-600 hover:bg-green-700 text-white control-button"
            >
              <div className="flex flex-col items-center space-y-1">
                <Play className="w-4 h-4" />
                <span className="text-xs">{isPaused ? t('control.resume') : t('control.start')}</span>
              </div>
            </Button>
            <Button
              onClick={handlePause}
              disabled={!isRunning || isPaused}
              className="bg-yellow-600 hover:bg-yellow-700 text-white control-button"
            >
              <div className="flex flex-col items-center space-y-1">
                <Pause className="w-4 h-4" />
                <span className="text-xs">{t('control.pause')}</span>
              </div>
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isRunning}
              className="bg-red-600 hover:bg-red-700 text-white control-button"
            >
              <div className="flex flex-col items-center space-y-1">
                <Square className="w-4 h-4" />
                <span className="text-xs">{t('control.stop')}</span>
              </div>
            </Button>
          </div>

          {/* Schedule Button */}
          <Button
            onClick={onSchedule}
            variant="outline"
            className="w-full control-button border-border hover:border-primary"
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{t('control.scheduleSession')}</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
