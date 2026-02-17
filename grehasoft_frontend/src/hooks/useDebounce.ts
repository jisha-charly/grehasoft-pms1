import { useState, useEffect } from 'react';

/**
 * Delays the update of a value to prevent rapid API calls.
 * Useful for search inputs and real-time filtering.
 * 
 * @param value The value to debounce
 * @param delay Time in milliseconds (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout if value changes before delay finishes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}