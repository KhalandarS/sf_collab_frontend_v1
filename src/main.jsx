import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./router/routes.jsx";
import { Provider } from "react-redux";
import { store } from "./services/store/store.js";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SocketProvider } from "./contexts/SocketContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <SocketProvider> */}
        <RouterProvider router={router} />
    {/* </SocketProvider> */}
  </Provider>
);
