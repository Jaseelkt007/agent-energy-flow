import { useEffect, useRef, useState } from "react";

export function usePolling<T>(fn: () => Promise<T>, intervalMs = 2000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const inFlight = useRef(false);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      if (cancelled) return;
      if (document.visibilityState === "hidden") {
        timer = setTimeout(tick, intervalMs);
        return;
      }
      if (inFlight.current) {
        timer = setTimeout(tick, intervalMs);
        return;
      }
      inFlight.current = true;
      try {
        const result = await fnRef.current();
        if (!cancelled) {
          setData(result);
          setError(null);
          setLastUpdated(Date.now());
        }
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        inFlight.current = false;
        if (!cancelled) timer = setTimeout(tick, intervalMs);
      }
    };

    tick();
    const onVis = () => {
      if (document.visibilityState === "visible" && !inFlight.current) {
        if (timer) clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [intervalMs]);

  return { data, error, lastUpdated };
}
