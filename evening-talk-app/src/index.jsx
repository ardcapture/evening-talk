import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDMDAJ0FUSbgaUWuvwItnpgtkCizDvinAA",
  authDomain: "my-react-blog-2c206.firebaseapp.com",
  projectId: "my-react-blog-2c206",
  storageBucket: "my-react-blog-2c206.appspot.com",
  messagingSenderId: "664831078215",
  appId: "1:664831078215:web:d6beff32a37d47798aa662",
};
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
