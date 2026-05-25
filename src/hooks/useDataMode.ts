import { useCallback, useEffect, useState } from 'react';
import { getHealthStatus, resetDataModeCache, type HealthStatus } from '../lib/dataMode';

export function useDataMode() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (force = true) => {
    setLoading(true);
    if (force) resetDataModeCache();
    try {
      setStatus(await getHealthStatus(force));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh(false);
  }, [refresh]);

  return { status, loading, refresh };
}
