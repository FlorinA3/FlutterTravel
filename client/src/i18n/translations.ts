export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh';

export const translations: Record<SupportedLanguage, any> = {
  en: {
    app: {
      title: 'BLE Controller'
    },
    nav: {
      devices: 'Devices',
      logs: 'Logs',
      schedule: 'Schedule'
    },
    devices: {
      scan: 'Scan for Devices',
      scanning: 'Scanning...',
      addDevice: 'Add Device'
    },
    device: {
      status: {
        connected: 'Connected',
        disconnected: 'Disconnected',
        idle: 'Idle',
        running: 'Running',
        paused: 'Paused'
      },
      signal: {
        strong: 'Strong',
        medium: 'Medium',
        weak: 'Weak'
      }
    },
    control: {
      intensity: 'Intensity Level',
      duration: 'Duration (seconds)',
      durationHelp: '5 seconds to 2 hours (7200s)',
      remaining: 'Remaining',
      start: 'Start',
      pause: 'Pause',
      stop: 'Stop',
      scheduleSession: 'Schedule Session',
      confirmStart: 'Are you sure you want to start this session?',
      confirmStop: 'Are you sure you want to stop this session?'
    },
    intensity: {
      low: 'Low',
      medium: 'Med',
      high: 'High',
      max: 'Max'
    },
    logs: {
      sessionLogs: 'Session Logs',
      clearAll: 'Clear All',
      confirmClear: 'Are you sure you want to clear all logs?',
      noLogs: 'No session logs yet',
      intensity: 'Intensity',
      duration: 'Duration',
      outcome: {
        success: 'Success',
        stopped: 'Stopped',
        error: 'Error'
      }
    },
    schedule: {
      scheduledSessions: 'Scheduled Sessions',
      newSchedule: 'New Schedule',
      createSchedule: 'Create Schedule',
      createFirst: 'Create First Schedule',
      noSchedules: 'No scheduled sessions',
      selectDevice: 'Select Device',
      dateTime: 'Date & Time',
      intensity: 'Intensity',
      duration: 'Duration',
      confirmDelete: 'Are you sure you want to delete this schedule?',
      status: {
        pending: 'Pending',
        completed: 'Completed',
        failed: 'Failed',
        overdue: 'Overdue'
      }
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      about: 'About',
      debug: 'Debug Information',
      exportLogs: 'Export Logs'
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      supported: 'Supported',
      notSupported: 'Not Supported'
    },
    errors: {
      bluetoothNotSupported: 'Web Bluetooth API is not supported in this browser. Using simulation mode.',
      connectionFailed: 'Connection failed. Please try again.',
      fillAllFields: 'Please fill in all required fields.'
    }
  },
  es: {
    app: {
      title: 'Controlador BLE'
    },
    nav: {
      devices: 'Dispositivos',
      logs: 'Registros',
      schedule: 'Horario'
    },
    devices: {
      scan: 'Buscar Dispositivos',
      scanning: 'Buscando...',
      addDevice: 'Agregar Dispositivo'
    },
    device: {
      status: {
        connected: 'Conectado',
        disconnected: 'Desconectado',
        idle: 'Inactivo',
        running: 'Ejecutando',
        paused: 'Pausado'
      },
      signal: {
        strong: 'Fuerte',
        medium: 'Medio',
        weak: 'Débil'
      }
    },
    control: {
      intensity: 'Nivel de Intensidad',
      duration: 'Duración (segundos)',
      durationHelp: '5 segundos a 2 horas (7200s)',
      remaining: 'Restante',
      start: 'Iniciar',
      pause: 'Pausar',
      stop: 'Detener',
      scheduleSession: 'Programar Sesión',
      confirmStart: '¿Está seguro de que desea iniciar esta sesión?',
      confirmStop: '¿Está seguro de que desea detener esta sesión?'
    },
    intensity: {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
      max: 'Máximo'
    },
    logs: {
      sessionLogs: 'Registros de Sesión',
      clearAll: 'Borrar Todo',
      confirmClear: '¿Está seguro de que desea borrar todos los registros?',
      noLogs: 'Aún no hay registros de sesión',
      intensity: 'Intensidad',
      duration: 'Duración',
      outcome: {
        success: 'Éxito',
        stopped: 'Detenido',
        error: 'Error'
      }
    },
    schedule: {
      scheduledSessions: 'Sesiones Programadas',
      newSchedule: 'Nuevo Horario',
      createSchedule: 'Crear Horario',
      createFirst: 'Crear Primer Horario',
      noSchedules: 'No hay sesiones programadas',
      selectDevice: 'Seleccionar Dispositivo',
      dateTime: 'Fecha y Hora',
      intensity: 'Intensidad',
      duration: 'Duración',
      confirmDelete: '¿Está seguro de que desea eliminar este horario?',
      status: {
        pending: 'Pendiente',
        completed: 'Completado',
        failed: 'Fallido',
        overdue: 'Atrasado'
      }
    },
    settings: {
      title: 'Configuración',
      language: 'Idioma',
      about: 'Acerca de',
      debug: 'Información de Depuración',
      exportLogs: 'Exportar Registros'
    },
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      delete: 'Eliminar',
      supported: 'Compatible',
      notSupported: 'No Compatible'
    },
    errors: {
      bluetoothNotSupported: 'La API Web Bluetooth no es compatible con este navegador. Usando modo de simulación.',
      connectionFailed: 'Conexión fallida. Por favor intente de nuevo.',
      fillAllFields: 'Por favor complete todos los campos requeridos.'
    }
  },
  fr: {
    app: {
      title: 'Contrôleur BLE'
    },
    nav: {
      devices: 'Appareils',
      logs: 'Journaux',
      schedule: 'Planifier'
    },
    devices: {
      scan: 'Rechercher des Appareils',
      scanning: 'Recherche...',
      addDevice: 'Ajouter un Appareil'
    },
    device: {
      status: {
        connected: 'Connecté',
        disconnected: 'Déconnecté',
        idle: 'Inactif',
        running: 'En cours',
        paused: 'En pause'
      },
      signal: {
        strong: 'Fort',
        medium: 'Moyen',
        weak: 'Faible'
      }
    },
    control: {
      intensity: 'Niveau d\'Intensité',
      duration: 'Durée (secondes)',
      durationHelp: '5 secondes à 2 heures (7200s)',
      remaining: 'Restant',
      start: 'Démarrer',
      pause: 'Pause',
      stop: 'Arrêter',
      scheduleSession: 'Programmer une Session',
      confirmStart: 'Êtes-vous sûr de vouloir démarrer cette session?',
      confirmStop: 'Êtes-vous sûr de vouloir arrêter cette session?'
    },
    intensity: {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      max: 'Maximum'
    },
    logs: {
      sessionLogs: 'Journaux de Session',
      clearAll: 'Tout Effacer',
      confirmClear: 'Êtes-vous sûr de vouloir effacer tous les journaux?',
      noLogs: 'Aucun journal de session pour le moment',
      intensity: 'Intensité',
      duration: 'Durée',
      outcome: {
        success: 'Succès',
        stopped: 'Arrêté',
        error: 'Erreur'
      }
    },
    schedule: {
      scheduledSessions: 'Sessions Programmées',
      newSchedule: 'Nouveau Planning',
      createSchedule: 'Créer un Planning',
      createFirst: 'Créer le Premier Planning',
      noSchedules: 'Aucune session programmée',
      selectDevice: 'Sélectionner un Appareil',
      dateTime: 'Date et Heure',
      intensity: 'Intensité',
      duration: 'Durée',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce planning?',
      status: {
        pending: 'En attente',
        completed: 'Terminé',
        failed: 'Échoué',
        overdue: 'En retard'
      }
    },
    settings: {
      title: 'Paramètres',
      language: 'Langue',
      about: 'À propos',
      debug: 'Informations de Débogage',
      exportLogs: 'Exporter les Journaux'
    },
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      close: 'Fermer',
      delete: 'Supprimer',
      supported: 'Pris en charge',
      notSupported: 'Non pris en charge'
    },
    errors: {
      bluetoothNotSupported: 'L\'API Web Bluetooth n\'est pas prise en charge dans ce navigateur. Utilisation du mode simulation.',
      connectionFailed: 'Échec de la connexion. Veuillez réessayer.',
      fillAllFields: 'Veuillez remplir tous les champs requis.'
    }
  },
  de: {
    app: {
      title: 'BLE Controller'
    },
    nav: {
      devices: 'Geräte',
      logs: 'Protokolle',
      schedule: 'Zeitplan'
    },
    devices: {
      scan: 'Nach Geräten suchen',
      scanning: 'Suche...',
      addDevice: 'Gerät hinzufügen'
    },
    device: {
      status: {
        connected: 'Verbunden',
        disconnected: 'Getrennt',
        idle: 'Inaktiv',
        running: 'Läuft',
        paused: 'Pausiert'
      },
      signal: {
        strong: 'Stark',
        medium: 'Mittel',
        weak: 'Schwach'
      }
    },
    control: {
      intensity: 'Intensitätsstufe',
      duration: 'Dauer (Sekunden)',
      durationHelp: '5 Sekunden bis 2 Stunden (7200s)',
      remaining: 'Verbleibend',
      start: 'Starten',
      pause: 'Pause',
      stop: 'Stoppen',
      scheduleSession: 'Sitzung planen',
      confirmStart: 'Sind Sie sicher, dass Sie diese Sitzung starten möchten?',
      confirmStop: 'Sind Sie sicher, dass Sie diese Sitzung stoppen möchten?'
    },
    intensity: {
      low: 'Niedrig',
      medium: 'Mittel',
      high: 'Hoch',
      max: 'Maximum'
    },
    logs: {
      sessionLogs: 'Sitzungsprotokolle',
      clearAll: 'Alle löschen',
      confirmClear: 'Sind Sie sicher, dass Sie alle Protokolle löschen möchten?',
      noLogs: 'Noch keine Sitzungsprotokolle',
      intensity: 'Intensität',
      duration: 'Dauer',
      outcome: {
        success: 'Erfolgreich',
        stopped: 'Gestoppt',
        error: 'Fehler'
      }
    },
    schedule: {
      scheduledSessions: 'Geplante Sitzungen',
      newSchedule: 'Neuer Zeitplan',
      createSchedule: 'Zeitplan erstellen',
      createFirst: 'Ersten Zeitplan erstellen',
      noSchedules: 'Keine geplanten Sitzungen',
      selectDevice: 'Gerät auswählen',
      dateTime: 'Datum und Uhrzeit',
      intensity: 'Intensität',
      duration: 'Dauer',
      confirmDelete: 'Sind Sie sicher, dass Sie diesen Zeitplan löschen möchten?',
      status: {
        pending: 'Ausstehend',
        completed: 'Abgeschlossen',
        failed: 'Fehlgeschlagen',
        overdue: 'Überfällig'
      }
    },
    settings: {
      title: 'Einstellungen',
      language: 'Sprache',
      about: 'Über',
      debug: 'Debug-Informationen',
      exportLogs: 'Protokolle exportieren'
    },
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      close: 'Schließen',
      delete: 'Löschen',
      supported: 'Unterstützt',
      notSupported: 'Nicht unterstützt'
    },
    errors: {
      bluetoothNotSupported: 'Web Bluetooth API wird in diesem Browser nicht unterstützt. Simulationsmodus wird verwendet.',
      connectionFailed: 'Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      fillAllFields: 'Bitte füllen Sie alle erforderlichen Felder aus.'
    }
  },
  zh: {
    app: {
      title: 'BLE 控制器'
    },
    nav: {
      devices: '设备',
      logs: '日志',
      schedule: '计划'
    },
    devices: {
      scan: '搜索设备',
      scanning: '搜索中...',
      addDevice: '添加设备'
    },
    device: {
      status: {
        connected: '已连接',
        disconnected: '已断开',
        idle: '空闲',
        running: '运行中',
        paused: '已暂停'
      },
      signal: {
        strong: '强',
        medium: '中',
        weak: '弱'
      }
    },
    control: {
      intensity: '强度级别',
      duration: '持续时间（秒）',
      durationHelp: '5秒到2小时（7200秒）',
      remaining: '剩余',
      start: '开始',
      pause: '暂停',
      stop: '停止',
      scheduleSession: '计划会话',
      confirmStart: '您确定要开始此会话吗？',
      confirmStop: '您确定要停止此会话吗？'
    },
    intensity: {
      low: '低',
      medium: '中',
      high: '高',
      max: '最大'
    },
    logs: {
      sessionLogs: '会话日志',
      clearAll: '全部清除',
      confirmClear: '您确定要清除所有日志吗？',
      noLogs: '暂无会话日志',
      intensity: '强度',
      duration: '持续时间',
      outcome: {
        success: '成功',
        stopped: '已停止',
        error: '错误'
      }
    },
    schedule: {
      scheduledSessions: '计划会话',
      newSchedule: '新计划',
      createSchedule: '创建计划',
      createFirst: '创建首个计划',
      noSchedules: '无计划会话',
      selectDevice: '选择设备',
      dateTime: '日期和时间',
      intensity: '强度',
      duration: '持续时间',
      confirmDelete: '您确定要删除此计划吗？',
      status: {
        pending: '待定',
        completed: '已完成',
        failed: '失败',
        overdue: '逾期'
      }
    },
    settings: {
      title: '设置',
      language: '语言',
      about: '关于',
      debug: '调试信息',
      exportLogs: '导出日志'
    },
    common: {
      save: '保存',
      cancel: '取消',
      close: '关闭',
      delete: '删除',
      supported: '支持',
      notSupported: '不支持'
    },
    errors: {
      bluetoothNotSupported: '此浏览器不支持 Web 蓝牙 API。正在使用模拟模式。',
      connectionFailed: '连接失败。请重试。',
      fillAllFields: '请填写所有必填字段。'
    }
  }
};
