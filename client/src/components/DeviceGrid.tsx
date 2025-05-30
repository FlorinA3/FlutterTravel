import { Device } from "@/types";
import { useI18n } from "@/hooks/useI18n";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wifi, WifiOff } from "lucide-react";

interface DeviceGridProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
  onScanDevices: () => void;
}

export default function DeviceGrid({ devices, onDeviceSelect, onScanDevices }: DeviceGridProps) {
  const { t } = useI18n();

  const getStatusColor = (device: Device) => {
    if (!device.connected) return 'status-disconnected';
    if (device.status === 'running') return 'status-connected';
    if (device.status === 'paused') return 'status-paused';
    return 'status-connected';
  };

  const getStatusText = (device: Device) => {
    if (!device.connected) return t('device.status.disconnected');
    return t(`device.status.${device.status}`);
  };

  const getStatusBadgeColor = (device: Device) => {
    if (!device.connected) return 'bg-destructive/20 text-destructive';
    if (device.status === 'running') return 'bg-green-500/20 text-green-400';
    if (device.status === 'paused') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <div className="device-grid">
      {devices.map((device) => (
        <Card
          key={device.id}
          className="cursor-pointer hover:border-primary transition-colors bg-card border-border"
          onClick={() => onDeviceSelect(device)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`status-indicator ${getStatusColor(device)}`} />
                <span className="text-sm font-medium truncate">{device.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                {device.connected ? (
                  <Wifi className="w-4 h-4 text-primary" />
                ) : (
                  <WifiOff className="w-4 h-4 text-muted-foreground" />
                )}
                {device.battery !== null && (
                  <span className="text-xs text-muted-foreground">
                    {device.battery}%
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                Signal: <span className={device.connected ? 'text-green-400' : 'text-muted-foreground'}>
                  {device.connected ? t('device.signal.strong') : '--'}
                </span>
              </div>
              <div>
                Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(device)}`}>
                  {getStatusText(device)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Device Placeholder */}
      <Card
        className="cursor-pointer border-2 border-dashed border-border hover:border-primary transition-colors bg-card/50"
        onClick={onScanDevices}
      >
        <CardContent className="p-4 flex items-center justify-center h-full">
          <div className="text-center">
            <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <span className="text-xs text-muted-foreground">{t('devices.addDevice')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
