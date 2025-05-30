import { SessionLog, Schedule } from "@/types";

class StorageService {
  private db: IDBDatabase | null = null;
  private dbName = 'BLEControllerDB';
  private version = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create logs store
        if (!db.objectStoreNames.contains('logs')) {
          const logsStore = db.createObjectStore('logs', { keyPath: 'id' });
          logsStore.createIndex('timestamp', 'timestamp', { unique: false });
          logsStore.createIndex('deviceId', 'deviceId', { unique: false });
        }

        // Create schedules store
        if (!db.objectStoreNames.contains('schedules')) {
          const schedulesStore = db.createObjectStore('schedules', { keyPath: 'id' });
          schedulesStore.createIndex('datetime', 'datetime', { unique: false });
          schedulesStore.createIndex('deviceId', 'deviceId', { unique: false });
        }
      };
    });
  }

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  // Session Logs
  async addLog(log: SessionLog): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['logs'], 'readwrite');
    const store = transaction.objectStore('logs');
    await new Promise<void>((resolve, reject) => {
      const request = store.add(log);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllLogs(): Promise<SessionLog[]> {
    const db = this.ensureDB();
    const transaction = db.transaction(['logs'], 'readonly');
    const store = transaction.objectStore('logs');
    const index = store.index('timestamp');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const logs = request.result.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        resolve(logs);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearLogs(): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['logs'], 'readwrite');
    const store = transaction.objectStore('logs');
    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Schedules
  async addSchedule(schedule: Schedule): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['schedules'], 'readwrite');
    const store = transaction.objectStore('schedules');
    await new Promise<void>((resolve, reject) => {
      const request = store.add(schedule);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSchedules(): Promise<Schedule[]> {
    const db = this.ensureDB();
    const transaction = db.transaction(['schedules'], 'readonly');
    const store = transaction.objectStore('schedules');
    const index = store.index('datetime');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const schedules = request.result.sort((a, b) => 
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        );
        resolve(schedules);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['schedules'], 'readwrite');
    const store = transaction.objectStore('schedules');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(scheduleId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateSchedule(scheduleId: string, updates: Partial<Schedule>): Promise<void> {
    const db = this.ensureDB();
    const transaction = db.transaction(['schedules'], 'readwrite');
    const store = transaction.objectStore('schedules');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(scheduleId);
      getRequest.onsuccess = () => {
        const schedule = getRequest.result;
        if (schedule) {
          const updatedSchedule = { ...schedule, ...updates };
          const putRequest = store.put(updatedSchedule);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Schedule not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
}

export const storageService = new StorageService();
