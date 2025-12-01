import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'

import { LoaderProvider } from "./components/LoaderManager";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <LoaderProvider>
        <App />
      </LoaderProvider>

  </React.StrictMode>
);
