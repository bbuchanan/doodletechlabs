import "../styles/globals.css";
import "../styles/monaco.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import React from "react";

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
