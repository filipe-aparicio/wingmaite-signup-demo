'use client';

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

function isClient() {
  return typeof window !== 'undefined';
}

function readStorageValue<T>(key: string, initialValue: T): T {
  if (!isClient()) return initialValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    setStoredValue(readStorageValue(key, initialValue));
  }, [key, initialValue]);

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    value => {
      setStoredValue(prev => {
        const nextValue = value instanceof Function ? value(prev) : value;

        if (isClient()) {
          try {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          } catch {
            // Ignore storage write failures (quota/private mode).
          }
        }

        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
