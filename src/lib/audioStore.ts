// High-capacity client-side IndexedDB storage for audio files
// Allows unlimited audio uploads without hitting localStorage's 5MB quota

const DB_NAME = 'ujadu_mission_media_db';
const DB_VERSION = 1;
const AUDIO_STORE_NAME = 'audio_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) {
        db.createObjectStore(AUDIO_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// In-memory cache of object URLs so we don't recreate them needlessly
const objectUrlCache = new Map<string, string>();

export const AudioStore = {
  async saveAudioFile(id: string, file: Blob): Promise<{ idbRef: string; objectUrl: string }> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(AUDIO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      const request = store.put(file, id);
      request.onsuccess = () => {
        // Create an Object URL for immediate playback & download
        if (objectUrlCache.has(id)) {
          URL.revokeObjectURL(objectUrlCache.get(id)!);
        }
        const objUrl = URL.createObjectURL(file);
        objectUrlCache.set(id, objUrl);
        resolve({ idbRef: `idb://${id}`, objectUrl: objUrl });
      };
      request.onerror = () => reject(request.error);
    });
  },

  async getAudioFile(id: string): Promise<Blob | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(AUDIO_STORE_NAME, 'readonly');
        const store = transaction.objectStore(AUDIO_STORE_NAME);
        const request = store.get(id);
        request.onsuccess = () => resolve((request.result as Blob) || null);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async getAudioUrl(id: string): Promise<string | null> {
    if (objectUrlCache.has(id)) {
      return objectUrlCache.get(id)!;
    }
    try {
      const blob = await this.getAudioFile(id);
      if (blob) {
        const url = URL.createObjectURL(blob);
        objectUrlCache.set(id, url);
        return url;
      }
      return null;
    } catch {
      return null;
    }
  },

  async deleteAudioFile(id: string): Promise<void> {
    if (objectUrlCache.has(id)) {
      URL.revokeObjectURL(objectUrlCache.get(id)!);
      objectUrlCache.delete(id);
    }
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(AUDIO_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(AUDIO_STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      });
    } catch {
      // ignore
    }
  },
};
