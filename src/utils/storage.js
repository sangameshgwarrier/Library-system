import { INITIAL_BOOKS } from '../data/initialBooks';
import { INITIAL_MEMBERS } from '../data/initialMembers';
import { getInitialLoans, INITIAL_SETTINGS } from '../data/initialLoans';

const STORAGE_KEYS = {
  BOOKS: 'athena_library_books',
  MEMBERS: 'athena_library_members',
  LOANS: 'athena_library_loans',
  SETTINGS: 'athena_library_settings',
  LOGS: 'athena_library_logs',
  VERSION: 'athena_library_storage_version'
};

const CURRENT_DATA_VERSION = '2.1_indian_locale';

export const loadFromStorage = (key, defaultData) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultData;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading storage for key ${key}:`, e);
    return defaultData;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed saving storage for key ${key}:`, e);
  }
};

export const initializeAppData = () => {
  const version = loadFromStorage(STORAGE_KEYS.VERSION, null);

  // If upgrading to Indian names version, refresh default members, loans, and settings
  if (version !== CURRENT_DATA_VERSION) {
    const freshMembers = INITIAL_MEMBERS;
    const freshLoans = getInitialLoans();
    const freshSettings = INITIAL_SETTINGS;
    const books = loadFromStorage(STORAGE_KEYS.BOOKS, INITIAL_BOOKS);
    const logs = [
      {
        id: 'log-in-1',
        timestamp: new Date().toISOString(),
        action: 'Locale Synchronized',
        details: 'Patron and Librarian profiles updated to Indian academic directory.'
      }
    ];

    saveToStorage(STORAGE_KEYS.MEMBERS, freshMembers);
    saveToStorage(STORAGE_KEYS.LOANS, freshLoans);
    saveToStorage(STORAGE_KEYS.SETTINGS, freshSettings);
    saveToStorage(STORAGE_KEYS.BOOKS, books);
    saveToStorage(STORAGE_KEYS.LOGS, logs);
    saveToStorage(STORAGE_KEYS.VERSION, CURRENT_DATA_VERSION);

    return { books, members: freshMembers, loans: freshLoans, settings: freshSettings, logs };
  }

  let books = loadFromStorage(STORAGE_KEYS.BOOKS, null);
  let members = loadFromStorage(STORAGE_KEYS.MEMBERS, null);
  let loans = loadFromStorage(STORAGE_KEYS.LOANS, null);
  let settings = loadFromStorage(STORAGE_KEYS.SETTINGS, null);
  let logs = loadFromStorage(STORAGE_KEYS.LOGS, null);

  if (!books) {
    books = INITIAL_BOOKS;
    saveToStorage(STORAGE_KEYS.BOOKS, books);
  }
  if (!members) {
    members = INITIAL_MEMBERS;
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
  }
  if (!loans) {
    loans = getInitialLoans();
    saveToStorage(STORAGE_KEYS.LOANS, loans);
  }
  if (!settings) {
    settings = INITIAL_SETTINGS;
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }
  if (!logs) {
    logs = [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        action: 'System Initialized',
        details: 'Library Management System loaded with default catalog and active circulations.'
      }
    ];
    saveToStorage(STORAGE_KEYS.LOGS, logs);
  }

  return { books, members, loans, settings, logs };
};

export const resetToDemoData = () => {
  localStorage.removeItem(STORAGE_KEYS.BOOKS);
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.LOANS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.VERSION);
  localStorage.removeItem('athena_auth_session');
  return initializeAppData();
};

export { STORAGE_KEYS };
