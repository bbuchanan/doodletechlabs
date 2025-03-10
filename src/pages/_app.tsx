import "../styles/globals.css";
import "../styles/monaco.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import React, { useState, useEffect } from "react";
import { LoadingProvider } from "../components/layout/LoadingContext";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
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
