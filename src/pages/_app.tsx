import "../styles/globals.css";
import "../styles/monaco.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import React, { useState, useEffect, useRef } from "react";
import { LoadingProvider } from "../components/layout/LoadingContext";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const loadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const routeChangeCompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if component is mounted
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Force loading to stop after a maximum timeout
    const maxLoadingDuration = 8000;

    const clearTimers = () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }

      if (routeChangeCompleteTimeoutRef.current) {
        clearTimeout(routeChangeCompleteTimeoutRef.current);
        routeChangeCompleteTimeoutRef.current = null;
      }
    };

    const handleStart = () => {
      clearTimers();

      // Add a small delay to prevent flashing for quick loads
      loadTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsLoading(true);

          // Safety timeout to prevent loading indicator getting stuck
          routeChangeCompleteTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              console.warn("Route change took too long - forcing loading to stop");
              setIsLoading(false);
            }
          }, maxLoadingDuration);
        }
      }, 100);
    };

    const handleComplete = () => {
      clearTimers();

      // Small delay to ensure transitions complete
      setTimeout(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }, 100);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      clearTimers();
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <LoadingProvider initialState={isLoading}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <LoadingSpinner />
    </LoadingProvider>
  );
}

export default MyApp;
