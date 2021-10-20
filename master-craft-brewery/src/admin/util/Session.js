import { useState, useEffect } from 'react';

function getSessionStorageOrDefault(key, defaultValue) {
  const stored = sessionStorage.getItem(key);
  if (stored === "")
    return stored;
  if (!stored) {
    return defaultValue;
  }
  return stored;
}

export function useSessionStorage(key, defaultValue) {
  const [value, setValue] = useState(
    getSessionStorageOrDefault(key, defaultValue)
  );

  useEffect(() => {
    sessionStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}