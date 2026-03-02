import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MuiThemeProvider } from "./context/MuiThemeProvider";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/error/ErrorFallback";

export const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <AuthProvider>
          <MuiThemeProvider>
            {children}
          </MuiThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};