import { useEffect, useState } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // For React Native, the framework is ready immediately
    // For web, we might need to wait for certain resources
    const timer = setTimeout(() => {
      setIsReady(true);
      window.frameworkReady?.();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return isReady;
}
