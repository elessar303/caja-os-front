/**
 * Configuración de almacenamiento
 * Habilita o deshabilita la codificación de datos sensibles en storage
 */
export const STORAGE_ENCODE_ENABLED =
  import.meta.env.VITE_STORAGE_ENCODE_ENABLED === "true" || false;

/**
 * Codifica una cadena a Base64
 */
export const encodeData = (data: string): string => {
  if (!STORAGE_ENCODE_ENABLED) {
    return data;
  }
  try {
    return btoa(unescape(encodeURIComponent(data)));
  } catch (error) {
    console.error("Error encoding data:", error);
    return data;
  }
};

/**
 * Decodifica una cadena desde Base64
 */
export const decodeData = (encodedData: string): string => {
  if (!STORAGE_ENCODE_ENABLED) {
    return encodedData;
  }
  try {
    return decodeURIComponent(escape(atob(encodedData)));
  } catch (error) {
    console.error("Error decoding data:", error);
    return encodedData;
  }
};

/**
 * Guarda datos en sessionStorage con codificación opcional
 */
export const saveToSessionStorage = (key: string, data: unknown): void => {
  try {
    const jsonString = JSON.stringify(data);
    const encoded = encodeData(jsonString);
    sessionStorage.setItem(key, encoded);
  } catch (error) {
    console.error(`Error saving to sessionStorage (${key}):`, error);
  }
};

/**
 * Lee datos de sessionStorage con decodificación opcional
 */
export const getFromSessionStorage = <T>(key: string): T | null => {
  try {
    const encoded = sessionStorage.getItem(key);
    if (!encoded) {
      return null;
    }
    const decoded = decodeData(encoded);
    return JSON.parse(decoded) as T;
  } catch (error) {
    console.error(`Error reading from sessionStorage (${key}):`, error);
    return null;
  }
};

/**
 * Elimina datos de sessionStorage
 */
export const removeFromSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from sessionStorage (${key}):`, error);
  }
};
