import { useState, useEffect, useCallback, useRef } from "react";
import { useLoading } from "../components/layout/LoadingContext";

interface UseToolLoadProps {
  initialLoadDelay?: number; // Delay before showing loading state (prevents flicker for fast loads)
  loadingTimeout?: number; // Maximum loading time before assuming something went wrong
  debug?: boolean; // Enable debug logs
}

/**
 * Custom hook for handling tool loading states
 * This helps with showing/hiding loading indicators and handling performance
 */
const useToolLoad = ({ initialLoadDelay = 150, loadingTimeout = 15000, debug = false }: UseToolLoadProps = {}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const loadingTimerId = useRef<NodeJS.Timeout | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const isLoadingActive = useRef<boolean>(false);

  // Function references to avoid circular dependencies
  const completeLoadRef = useRef<() => void>(() => {});
  const startLoadRef = useRef<() => void>(() => {});

  // Debug logger
  const log = useCallback(
    (message: string) => {
      if (debug) {
        console.log(`[LoadingState] ${message}`);
      }
    },
    [debug]
  );

  // Complete loading sequence
  const completeLoad = useCallback(() => {
    log("Completing load sequence");

    if (loadingTimerId.current) {
      clearTimeout(loadingTimerId.current);
      loadingTimerId.current = null;
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }

    isLoadingActive.current = false;
    setIsLoading(false);
    setIsReady(true);
    stopLoading();
  }, [stopLoading, log]);

  // Update ref when the callback changes
  useEffect(() => {
    completeLoadRef.current = completeLoad;
  }, [completeLoad]);

  // Start loading sequence
  const startLoad = useCallback(() => {
    log("Starting load sequence");

    // Clear any existing timers
    if (loadingTimerId.current) {
      clearTimeout(loadingTimerId.current);
      loadingTimerId.current = null;
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }

    setIsReady(false);
    setError(null);
    isLoadingActive.current = true;
    setIsLoading(true);

    // Set delayed loading state to prevent flicker for fast loads
    loadingTimerId.current = setTimeout(() => {
      if (isLoadingActive.current) {
        log("Showing loading indicator");
        startLoading();
      }
    }, initialLoadDelay);

    // Set timeout for maximum loading time
    timeoutId.current = setTimeout(() => {
      if (isLoadingActive.current) {
        log("Loading timeout triggered");
        setError("Loading took too long. Please try again.");
        completeLoadRef.current();
      }
    }, loadingTimeout);
  }, [initialLoadDelay, loadingTimeout, startLoading, log]);

  // Update ref when the callback changes
  useEffect(() => {
    startLoadRef.current = startLoad;
  }, [startLoad]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      log("Cleaning up on unmount");
      if (loadingTimerId.current) clearTimeout(loadingTimerId.current);
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (isLoadingActive.current) {
        stopLoading();
      }
    };
  }, [stopLoading, log]);

  return {
    isReady,
    error,
    startLoad,
    completeLoad,
    isLoading,
  };
};

export default useToolLoad;
