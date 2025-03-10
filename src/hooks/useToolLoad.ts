import { useState, useEffect } from "react";
import { useLoading } from "../components/layout/LoadingContext";

interface UseToolLoadProps {
  initialLoadDelay?: number; // Delay before showing loading state (prevents flicker for fast loads)
  loadingTimeout?: number; // Maximum loading time before assuming something went wrong
}

/**
 * Custom hook for handling tool loading states
 * This helps with showing/hiding loading indicators and handling performance
 */
const useToolLoad = ({ initialLoadDelay = 200, loadingTimeout = 10000 }: UseToolLoadProps = {}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const [loadingTimerId, setLoadingTimerId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Start loading sequence
  const startLoad = () => {
    // Clear any existing timers
    if (loadingTimerId) clearTimeout(loadingTimerId);
    if (timeoutId) clearTimeout(timeoutId);

    setIsReady(false);
    setError(null);

    // Set delayed loading state to prevent flicker for fast loads
    const newLoadingTimer = setTimeout(() => {
      startLoading();
    }, initialLoadDelay);

    // Set timeout for maximum loading time
    const newTimeoutId = setTimeout(() => {
      setError("Loading took too long. Please try again.");
      stopLoading();
    }, loadingTimeout);

    setLoadingTimerId(newLoadingTimer);
    setTimeoutId(newTimeoutId);
  };

  // Complete loading sequence
  const completeLoad = () => {
    if (loadingTimerId) clearTimeout(loadingTimerId);
    if (timeoutId) clearTimeout(timeoutId);
    setLoadingTimerId(null);
    setTimeoutId(null);
    setIsReady(true);
    stopLoading();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerId) clearTimeout(loadingTimerId);
      if (timeoutId) clearTimeout(timeoutId);
      stopLoading();
    };
  }, [loadingTimerId, timeoutId, stopLoading]);

  return {
    isReady,
    error,
    startLoad,
    completeLoad,
  };
};

export default useToolLoad;
