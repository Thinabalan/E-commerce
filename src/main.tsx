import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import { MuiThemeProvider } from './context/MuiThemeProvider';
import { SnackbarProvider } from './context/SnackbarContext';
import { DialogProvider } from './context/DialogContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <BrowserRouter>
      <AuthProvider>
          <MuiThemeProvider>
            <SnackbarProvider>
              <DialogProvider>
                <App />
              </DialogProvider>
            </SnackbarProvider>
          </MuiThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);
