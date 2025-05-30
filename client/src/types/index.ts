export interface Device {
  id: string;
  name: string;
  connected: boolean;
  status: 'idle' | 'running' | 'paused';
  battery: number | null;
  lastSeen: string;
}

export interface SessionLog {
  id: string;
  deviceId: string;
  deviceName: string;
  intensity: 'low' | 'medium' | 'high' | 'max';
  duration: number; // in seconds
  outcome: 'success' | 'stopped' | 'error';
  timestamp: string;
}

export interface Schedule {
  id: string;
  deviceId: string;
  deviceName: string;
  datetime: string;
  intensity: 'low' | 'medium' | 'high' | 'max';
  duration: number; // in seconds
  status: 'pending' | 'completed' | 'failed';
}

export interface BluetoothCommand {
  type: 'start' | 'pause' | 'stop';
  intensity?: 'low' | 'medium' | 'high' | 'max';
  duration?: number;
}
