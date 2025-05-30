import { SessionLog, Schedule } from "@/types";

class StorageService {
  private db: IDBDatabase | null = null;
  private dbName = 'BLEControllerDB';
  private version = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        console.log("[StorageService] DB already initialized.");
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error("[StorageService] DB open error:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("[StorageService] DB initialized successfully.");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log("[StorageService] DB upgrade needed.");

        if (!db.objectStoreNames.contains('logs')) {
          const logsStore = db.createObjectStore('logs', { keyPath: 'id' });
          logsStore.createIndex('timestamp', 'timestamp', { unique: false });
          logsStore.createIndex('deviceId', 'deviceId', { unique: false });
          console.log("[StorageService] Created object store 'logs'.");
        }

        if (!db.objectStoreNames.contains('schedules')) {
          const schedulesStore = db.createObjectStore('schedules', { keyPath: 'id' });
          schedulesStore.createIndex('datetime', 'datetime', { unique: false });
          schedulesStore.createIndex('deviceId', 'deviceId', { unique: false });
          console.log("[StorageService] Created object store 'schedules'.");
        }
      };
    });
  }

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error('[StorageService] Database not initialized. Please call init() first.');
    }
    return this.db;
  }

  // Add a session log entry
  async addLog(log: SessionLog): Promise<void> {
    try {
      const db = this.ensureDB();
      const transaction = db.transaction(['logs'], 'readwrite');
      const store = transaction.objectStore('logs');
      return new Promise<void>((resolve, reject) => {
        const request = store.add(log);
        request.onsuccess = () => {
          console.log(`[StorageService] Log added: ${log.id}`);
          resolve();
        };
        request.onerror = () => {
          console.error("[StorageService] Failed to add log:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("[StorageService] addLog error:", error);
      return Promise.reject(error);
    }
  }

  // Fetch all session logs sorted newest first
  async getAllLogs(): Promise<SessionLog[]> {
    try {
      const db = this.ensureDB();
      const transaction = db.transaction(['logs'], 'readonly');
      const store = transaction.objectStore('logs');
      const index = store.index('timestamp');

      return new Promise((resolve, reject) => {
        const request = index.getAll();
        request.onsuccess = () => {
          const logs = request.result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          console.log(`[StorageService] Retrieved ${logs.length} logs.`);
          resolve(logs);
        };
        request.onerror = () => {
          console.error("[StorageService] Failed to get logs:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("[StorageService] getAllLogs error:", error);
      return Promise.reject(error);
    }
  }

  // Clear all session logs
  async clearLogs(): Promise<void> {
    try {
      const db = this.ensureDB();
      const transaction = db.transaction(['logs'], 'readwrite');
      const store = transaction.objectStore('logs');
      return new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
          console.log("[StorageService] Logs cleared.");
          resolve();
        };
        request.onerror = () => {
          console.error("[StorageService] Failed to clear logs:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("[StorageService] clearLogs error:", error);
      return Promise.reject(error);
    }
  }

  // Schedule methods (same pattern, added logging for completeness)
  async addSchedule(schedule: Schedule): Promise<void> {
    try {
      const db = this.ensureDB();
      const transaction = db.transaction(['schedules'], 'readwrite');
      const store = transaction.objectStore('schedules');
      return new Promise<void>((resolve, reject) => {
        const request = store.add(schedule);
        request.onsuccess = () => {
          console.log(`[StorageService] Schedule added: ${schedule.id}`);
          resolve();
        };
        request.onerror = () => {
          console.error("[StorageService] Failed to add schedule:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("[StorageService] addSchedule error:", error);
      return Promise.reject(error);
    }
  }

  async getAllSchedules(): Promise<Schedule[]> {
    try {
      const db = this.ensureDB();
      const transaction = db.transaction(['schedules'], 'readonly');
      const store = transaction.objectStore('schedules');
      const index = store.index('datetime');

      return new Promise((resolve, reject) => {
        const request = index.getAll();
        request.onsuccess = () => {
          const schedules = request.result.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
          console.log(`[StorageService] Retrieved ${schedules.length} schedules.`);
          resolve(schedules);
        };
        request.onerror = () => {
          console.error("[StorageService] Failed to get schedules:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("[StorageService] getAllSchedules error:", error);
      return Promise.reject(error);
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      const db = this.ensureDB();
      const transaction = db.transaction(['schedules'], 'readwrite');
      const store = transaction.objectStore('schedules');
      return new Promise<void>((resolve, reject) => {
        const request = store.delete(scheduleId);
        request.onsuccess = () => {
          console.log(`[StorageService] Schedule deleted: ${scheduleId}`);
          resolve();
        };
        request.onerror = () => {
          console.error("[StorageService] Failed to delete schedule:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("[StorageService] deleteSchedule error:", error);
      return Promise.reject(error);
    }
  }

  async updateSchedule(scheduleId: string, updates: Partial<Schedule>): Promise<void> {
    try {
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
            putRequest.onsuccess = () => {
              console.log(`[StorageService] Schedule updated: ${scheduleId}`);
              resolve();
            };
            putRequest.onerror = () => {
              console.error("[StorageService] Failed to update schedule:", putRequest.error);
              reject(putRequest.error);
            };
          } else {
            reject(new Error('Schedule not found'));
          }
        };
        getRequest.onerror = () => {
          console.error("[StorageService] Failed to fetch schedule:", getRequest.error);
          reject(getRequest.error);
        };
      });
    } catch (error) {
      console.error("[StorageService] updateSchedule error:", error);
      return Promise.reject(error);
    }
  }

  // OPTIONAL helper: log session start or stop explicitly
  async logSessionEvent(sessionId: string, event: 'start' | 'stop', deviceId?: string) {
    const timestamp = new Date().toISOString();
    const log: SessionLog = {
      id: sessionId + '-' + event + '-' + timestamp,
      timestamp,
      deviceId: deviceId || 'unknown',
      event,
    };
    return this.addLog(log);
  }
}

export const storageService = new StorageService();
