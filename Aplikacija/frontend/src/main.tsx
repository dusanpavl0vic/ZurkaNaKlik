import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import "../src/styles/index.css";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import Toastify from "./components/Toastify/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toastify />
    </Provider>
  </React.StrictMode>
);
