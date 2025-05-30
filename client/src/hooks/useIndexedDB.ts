import { useState, useEffect } from "react";
import { SessionLog, Schedule } from "@/types";
import { storageService } from "@/services/storageService";

export function useIndexedDB() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await storageService.init();
        await loadData();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
      }
    };

    initializeDB();
  }, []);

  const loadData = async () => {
    try {
      const [logsData, schedulesData] = await Promise.all([
        storageService.getAllLogs(),
        storageService.getAllSchedules(),
      ]);
      setLogs(logsData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const addLog = async (log: SessionLog) => {
    try {
      await storageService.addLog(log);
      setLogs(prev => [log, ...prev]);
    } catch (error) {
      console.error('Failed to add log:', error);
      throw error;
    }
  };

  const clearLogs = async () => {
    try {
      await storageService.clearLogs();
      setLogs([]);
    } catch (error) {
      console.error('Failed to clear logs:', error);
      throw error;
    }
  };

  const addSchedule = async (schedule: Schedule) => {
    try {
      await storageService.addSchedule(schedule);
      setSchedules(prev => [schedule, ...prev]);
    } catch (error) {
      console.error('Failed to add schedule:', error);
      throw error;
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await storageService.deleteSchedule(scheduleId);
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      throw error;
    }
  };

  const updateSchedule = async (scheduleId: string, updates: Partial<Schedule>) => {
    try {
      await storageService.updateSchedule(scheduleId, updates);
      setSchedules(prev => prev.map(s => 
        s.id === scheduleId ? { ...s, ...updates } : s
      ));
    } catch (error) {
      console.error('Failed to update schedule:', error);
      throw error;
    }
  };

  return {
    logs,
    schedules,
    isInitialized,
    addLog,
    clearLogs,
    addSchedule,
    deleteSchedule,
    updateSchedule,
  };
}
