// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
      retry: 1,
      staleTime: 1000 * 30,
    },
  } as any,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Toaster position="top-right" />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
