import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './componets/context/AuthContext.jsx';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
        autoHideDuration={3000}
      >
       <LocalizationProvider dateAdapter={AdapterDateFns}>
    <App />
  </LocalizationProvider>
    </SnackbarProvider>
    </AuthProvider>
  </StrictMode>,
)
