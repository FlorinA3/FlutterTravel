import { useState, useEffect, useCallback } from "react";
import { Device } from "@/types";
import { bluetoothService } from "@/services/bluetoothService";

export function useBluetooth() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setDebugLogs(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
  }, []);

  useEffect(() => {
    const supported = bluetoothService.isSupported();
    setIsBluetoothSupported(supported);
    addDebugLog(`Bluetooth support: ${supported ? 'Available' : 'Not available'}`);

    if (!supported) {
      // Initialize simulation mode with mock devices
      initializeSimulationMode();
    }
  }, [addDebugLog]);

  const initializeSimulationMode = () => {
    const mockDevices: Device[] = [
      {
        id: 'sim-device-001',
        name: 'Disinfector #001',
        connected: true,
        status: 'idle',
        battery: 85,
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'sim-device-002',
        name: 'Disinfector #002',
        connected: true,
        status: 'idle',
        battery: 67,
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'sim-device-003',
        name: 'Disinfector #003',
        connected: true,
        status: 'idle',
        battery: 92,
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'sim-device-004',
        name: 'Disinfector #004',
        connected: false,
        status: 'idle',
        battery: null,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ];
    setDevices(mockDevices);
    addDebugLog('Initialized simulation mode with mock devices');
  };

  const scanForDevices = useCallback(async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    addDebugLog('Starting device scan...');

    try {
      if (isBluetoothSupported) {
        const newDevices = await bluetoothService.scanForDevices();
        setDevices(prev => {
          const existingIds = prev.map(d => d.id);
          const uniqueNewDevices = newDevices.filter(d => !existingIds.includes(d.id));
          return [...prev, ...uniqueNewDevices];
        });
        addDebugLog(`Found ${newDevices.length} devices`);
      } else {
        // Simulation: add a random device occasionally
        if (Math.random() > 0.5) {
          const newDevice: Device = {
            id: `sim-device-${Date.now()}`,
            name: `Disinfector #${devices.length + 1}`,
            connected: false,
            status: 'idle',
            battery: null,
            lastSeen: new Date().toISOString(),
          };
          setDevices(prev => [...prev, newDevice]);
          addDebugLog(`Simulation: Found new device ${newDevice.name}`);
        }
      }
    } catch (error) {
      addDebugLog(`Scan error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsScanning(false);
      addDebugLog('Device scan completed');
    }
  }, [isScanning, isBluetoothSupported, devices.length, addDebugLog]);

  const connectToDevice = useCallback(async (deviceId: string) => {
    addDebugLog(`Attempting to connect to device ${deviceId}`);
    
    try {
      if (isBluetoothSupported) {
        await bluetoothService.connectToDevice(deviceId);
      } else {
        // Simulation: random success/failure
        if (Math.random() > 0.2) {
          throw new Error('Connection failed (simulation)');
        }
      }

      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSeen: new Date().toISOString() }
          : device
      ));
      addDebugLog(`Successfully connected to device ${deviceId}`);
    } catch (error) {
      addDebugLog(`Connection failed for device ${deviceId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }, [isBluetoothSupported, addDebugLog]);

  const sendCommand = useCallback(async (deviceId: string, command: string, params?: any) => {
    addDebugLog(`Sending command '${command}' to device ${deviceId}`);
    
    try {
      if (isBluetoothSupported) {
        await bluetoothService.sendCommand(deviceId, command, params);
      } else {
        // Simulation: just log the command
        addDebugLog(`Simulation: Command '${command}' sent to ${deviceId}`);
      }

      // Update device status based on command
      if (command === 'start') {
        setDevices(prev => prev.map(device => 
          device.id === deviceId 
            ? { ...device, status: 'running', lastSeen: new Date().toISOString() }
            : device
        ));
      } else if (command === 'pause') {
        setDevices(prev => prev.map(device => 
          device.id === deviceId 
            ? { ...device, status: 'paused', lastSeen: new Date().toISOString() }
            : device
        ));
      } else if (command === 'stop') {
        setDevices(prev => prev.map(device => 
          device.id === deviceId 
            ? { ...device, status: 'idle', lastSeen: new Date().toISOString() }
            : device
        ));
      }

      addDebugLog(`Command '${command}' executed successfully on device ${deviceId}`);
    } catch (error) {
      addDebugLog(`Command '${command}' failed on device ${deviceId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }, [isBluetoothSupported, addDebugLog]);

  return {
    devices,
    isScanning,
    isBluetoothSupported,
    debugLogs,
    scanForDevices,
    connectToDevice,
    sendCommand,
  };
}
