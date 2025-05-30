import { Device } from "@/types";

class BluetoothService {
  private devices = new Map<string, BluetoothDevice>();

  isSupported(): boolean {
    return 'bluetooth' in navigator && 'requestDevice' in navigator.bluetooth;
  }

  async scanForDevices(): Promise<Device[]> {
    if (!this.isSupported()) {
      throw new Error('Web Bluetooth API not supported');
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['device_information', 'battery_service']
      });

      const deviceInfo: Device = {
        id: device.id,
        name: device.name || 'Unknown Device',
        connected: false,
        status: 'idle',
        battery: null,
        lastSeen: new Date().toISOString(),
      };

      this.devices.set(device.id, device);
      return [deviceInfo];
    } catch (error) {
      if (error instanceof Error && error.name === 'NotFoundError') {
        // User cancelled the selection
        return [];
      }
      throw error;
    }
  }

  async connectToDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    try {
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }
      
      console.log('Connected to device:', device.name);
    } catch (error) {
      throw new Error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendCommand(deviceId: string, command: string, params?: any): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device || !device.gatt?.connected) {
      throw new Error('Device not connected');
    }

    try {
      // This would be implemented based on the actual BLE service characteristics
      // For now, we'll just log the command
      console.log(`Sending command to ${device.name}:`, { command, params });
      
      // Simulate command execution delay
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      throw new Error(`Command failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnectDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
  }

  async getBatteryLevel(deviceId: string): Promise<number | null> {
    const device = this.devices.get(deviceId);
    if (!device || !device.gatt?.connected) {
      return null;
    }

    try {
      const server = device.gatt;
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const value = await characteristic.readValue();
      return value.getUint8(0);
    } catch (error) {
      console.warn('Failed to read battery level:', error);
      return null;
    }
  }
}

export const bluetoothService = new BluetoothService();
