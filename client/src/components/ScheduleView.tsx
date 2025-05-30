import { Schedule, Device } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, Trash2 } from "lucide-react";

interface ScheduleViewProps {
  schedules: Schedule[];
  devices: Device[];
  onCreateSchedule: () => void;
}

export default function ScheduleView({ schedules, devices, onCreateSchedule }: ScheduleViewProps) {
  const { t } = useI18n();
  const { deleteSchedule } = useIndexedDB();

  const handleDeleteSchedule = async (scheduleId: string) => {
    const confirmed = window.confirm(t('schedule.confirmDelete'));
    if (confirmed) {
      await deleteSchedule(scheduleId);
    }
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (schedule: Schedule) => {
    const now = new Date();
    const scheduleTime = new Date(schedule.datetime);
    
    if (schedule.status === 'completed') return 'text-green-400';
    if (schedule.status === 'failed') return 'text-red-400';
    if (scheduleTime < now) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getStatusText = (schedule: Schedule) => {
    const now = new Date();
    const scheduleTime = new Date(schedule.datetime);
    
    if (schedule.status === 'completed') return t('schedule.status.completed');
    if (schedule.status === 'failed') return t('schedule.status.failed');
    if (scheduleTime < now) return t('schedule.status.overdue');
    return t('schedule.status.pending');
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{t('schedule.scheduledSessions')}</h2>
        <Button
          onClick={onCreateSchedule}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('schedule.newSchedule')}
        </Button>
      </div>

      {schedules.length > 0 ? (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">{schedule.deviceName}</span>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDateTime(schedule.datetime)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getStatusColor(schedule)}`}>
                      {getStatusText(schedule)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {t('schedule.intensity')}: <span className="text-foreground">{t(`intensity.${schedule.intensity}`)}</span>
                  </div>
                  <div>
                    {t('schedule.duration')}: <span className="text-foreground">{formatDuration(schedule.duration)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{t('schedule.noSchedules')}</p>
          <Button
            onClick={onCreateSchedule}
            variant="outline"
            className="border-border hover:border-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('schedule.createFirst')}
          </Button>
        </div>
      )}
    </div>
  );
}
