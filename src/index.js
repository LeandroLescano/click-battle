import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase/app";
import Routes from "./Routes";

firebase.initializeApp({
  apiKey: "AIzaSyBcEJHGsplG6KemwQ3XbPlxaQZbAEVce0c",
  authDomain: "click-battle-mp.firebaseapp.com",
  databaseURL: "https://click-battle-mp-default-rtdb.firebaseio.com",
  projectId: "click-battle-mp",
  storageBucket: "click-battle-mp.appspot.com",
  messagingSenderId: "55439914661",
  appId: "1:55439914661:web:5877e7ba22e1dcc0b1ff4c",
  measurementId: "G-ETTEKV9L5B",
});

// ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<Routes />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
