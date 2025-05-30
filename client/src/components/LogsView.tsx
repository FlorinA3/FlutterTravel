import { SessionLog } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, FileText } from "lucide-react";

interface LogsViewProps {
  logs: SessionLog[];
  onClearLogs: () => void;
}

export default function LogsView({ logs, onClearLogs }: LogsViewProps) {
  const { t } = useI18n();

  const handleClearLogs = () => {
    const confirmed = window.confirm(t('logs.confirmClear'));
    if (confirmed) {
      onClearLogs();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getOutcomeBadgeColor = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'stopped':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const displayedLogs = logs.slice(0, 10); // Show last 10 logs

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{t('logs.sessionLogs')}</h2>
        {logs.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearLogs}
            className="text-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('logs.clearAll')}
          </Button>
        )}
      </div>

      {displayedLogs.length > 0 ? (
        <div className="space-y-3">
          {displayedLogs.map((log) => (
            <Card key={log.id} className="log-entry bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{log.deviceName}</span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getOutcomeBadgeColor(log.outcome)}`}
                    >
                      {t(`logs.outcome.${log.outcome}`)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {t('logs.intensity')}: <span className="text-foreground">{t(`intensity.${log.intensity}`)}</span>
                  </div>
                  <div>
                    {t('logs.duration')}: <span className="text-foreground">{formatDuration(log.duration)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('logs.noLogs')}</p>
        </div>
      )}
    </div>
  );
}
