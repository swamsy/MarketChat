import { useState } from 'react';

function useSessionStorage(key, initialValue) {
  const storedValue = sessionStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = useState(initial);

  const setStoredValue = (newValue) => {
    sessionStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setStoredValue];
}

export default useSessionStorage;
