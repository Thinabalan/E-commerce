import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import { MuiThemeProvider } from './context/MuiThemeProvider';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/error/ErrorFallback';

import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <MuiThemeProvider>
              <UIProvider>
                <App />
              </UIProvider>
            </MuiThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </>
);
