import { useState } from "react";
import { Device, Schedule } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  selectedDevice?: Device | null;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  devices,
  selectedDevice,
}: ScheduleModalProps) {
  const [deviceId, setDeviceId] = useState(selectedDevice?.id || '');
  const [datetime, setDatetime] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high' | 'max'>('low');
  const [duration, setDuration] = useState(300);

  const { t } = useI18n();
  const { addSchedule } = useIndexedDB();

  const handleSave = async () => {
    if (!deviceId || !datetime) {
      alert(t('errors.fillAllFields'));
      return;
    }

    const schedule: Schedule = {
      id: crypto.randomUUID(),
      deviceId,
      deviceName: devices.find(d => d.id === deviceId)?.name || 'Unknown Device',
      datetime: new Date(datetime).toISOString(),
      intensity,
      duration,
      status: 'pending',
    };

    await addSchedule(schedule);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setDeviceId(selectedDevice?.id || '');
    setDatetime('');
    setIntensity('low');
    setDuration(300);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  // Set minimum datetime to current time
  const now = new Date();
  const minDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('schedule.createSchedule')}</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Device Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('schedule.selectDevice')}
            </Label>
            <Select value={deviceId} onValueChange={setDeviceId}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder={t('schedule.selectDevice')} />
              </SelectTrigger>
              <SelectContent>
                {devices
                  .filter(d => d.connected)
                  .map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Time */}
          <div>
            <Label htmlFor="datetime" className="text-sm font-medium mb-2 block">
              {t('schedule.dateTime')}
            </Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={datetime}
              min={minDatetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          {/* Intensity */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('schedule.intensity')}
            </Label>
            <Select value={intensity} onValueChange={(value: any) => setIntensity(value)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('intensity.low')}</SelectItem>
                <SelectItem value="medium">{t('intensity.medium')}</SelectItem>
                <SelectItem value="high">{t('intensity.high')}</SelectItem>
                <SelectItem value="max">{t('intensity.max')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
              {t('schedule.duration')}
            </Label>
            <Input
              id="duration"
              type="number"
              min="5"
              max="7200"
              value={duration}
              onChange={(e) => setDuration(Math.max(5, Math.min(7200, parseInt(e.target.value) || 5)))}
              className="bg-background border-border"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {t('control.durationHelp')}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-border hover:border-primary"
              onClick={handleClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>{t('common.save')}</span>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
