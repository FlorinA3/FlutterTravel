import { useState, useEffect } from "react";
import DeviceGrid from "@/components/DeviceGrid";
import DeviceControlModal from "@/components/DeviceControlModal";
import ScheduleModal from "@/components/ScheduleModal";
import SettingsModal from "@/components/SettingsModal";
import LogsView from "@/components/LogsView";
import ScheduleView from "@/components/ScheduleView";
import { useBluetooth } from "@/hooks/useBluetooth";
import { useIndexedDB } from "@/hooks/useIndexedDB";
import { useI18n } from "@/hooks/useI18n";
import { Device } from "@/types";
import { Button } from "@/components/ui/button";
import { Settings, Bluetooth, BluetoothConnected } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'devices' | 'logs' | 'schedule'>('devices');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { t } = useI18n();
  const { devices, isScanning, scanForDevices, connectToDevice, isBluetoothSupported } = useBluetooth();
  const { logs, schedules, clearLogs } = useIndexedDB();

  const connectedDevicesCount = devices.filter(d => d.connected).length;

  useEffect(() => {
    // Request Bluetooth permissions on app load if supported
    if (isBluetoothSupported && devices.length === 0) {
      scanForDevices();
    }
  }, [isBluetoothSupported]);

  const handleDeviceSelect = (device: Device) => {
    if (device.connected) {
      setSelectedDevice(device);
    } else {
      connectToDevice(device.id);
    }
  };

  const handleScanDevices = () => {
    if (isBluetoothSupported) {
      scanForDevices();
    } else {
      alert(t('errors.bluetoothNotSupported'));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/icons/device.svg" alt="Device" className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">{t('app.title')}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isBluetoothSupported ? (
                <BluetoothConnected className="w-5 h-5 text-primary" />
              ) : (
                <Bluetooth className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {connectedDevicesCount}/10
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettingsModal(true)}
              className="control-button"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border">
        <div className="flex">
          {(['devices', 'logs', 'schedule'] as const).map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {t(`nav.${tab}`)}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="p-4">
            <div className="mb-6">
              <Button
                onClick={handleScanDevices}
                disabled={isScanning}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground control-button"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Bluetooth className={`w-5 h-5 ${isScanning ? 'pulse-animation' : ''}`} />
                  <span>
                    {isScanning ? t('devices.scanning') : t('devices.scan')}
                  </span>
                </div>
              </Button>
            </div>
            <DeviceGrid
              devices={devices}
              onDeviceSelect={handleDeviceSelect}
              onScanDevices={handleScanDevices}
            />
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <LogsView logs={logs} onClearLogs={clearLogs} />
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <ScheduleView
            schedules={schedules}
            devices={devices}
            onCreateSchedule={() => setShowScheduleModal(true)}
          />
        )}
      </main>

      {/* Modals */}
      {selectedDevice && (
        <DeviceControlModal
          device={selectedDevice}
          isOpen={!!selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onSchedule={() => {
            setShowScheduleModal(true);
          }}
        />
      )}

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        devices={devices}
        selectedDevice={selectedDevice}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
}
