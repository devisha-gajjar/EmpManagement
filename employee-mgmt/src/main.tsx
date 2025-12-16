import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { LoaderProvider } from "./features/shared/LoaderContext.tsx";
import GlobalLoader from "./components/shared/loader/GlobalLoader.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
      <GlobalLoader />
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </Provider>
);
