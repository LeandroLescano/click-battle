import "../styles/globals.css";
import "../styles/styles.css";
import "../styles/index.css";
import type { AppProps } from "next/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import Layout from "../components/Layout";

const firebaseConfig = {
  apiKey: "AIzaSyBcEJHGsplG6KemwQ3XbPlxaQZbAEVce0c",
  authDomain: "click-battle-mp.firebaseapp.com",
  databaseURL: "https://click-battle-mp-default-rtdb.firebaseio.com",
  projectId: "click-battle-mp",
  storageBucket: "click-battle-mp.appspot.com",
  messagingSenderId: "55439914661",
  appId: "1:55439914661:web:5877e7ba22e1dcc0b1ff4c",
  measurementId: "G-ETTEKV9L5B",
};

if (!getApps.length) {
  initializeApp(firebaseConfig);
} else {
  getApp(); // if already initialized, use that one
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
export default MyApp;
