import '@fortawesome/fontawesome-free/css/all.min.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import { ThemeProvider } from './context/ThemeContext';
import { MuiThemeProvider } from './context/MuiThemeProvider';
import { SnackbarProvider } from './context/SnackbarContext';
import { DialogProvider } from './context/DialogContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <BrowserRouter>
      <ThemeProvider>
        <MuiThemeProvider>
          <SnackbarProvider>
            <DialogProvider>
              <App />
            </DialogProvider>
          </SnackbarProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </>
);
