// src/hooks/useSnackbarNotifier.tsx
import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

const SlideTransition = React.forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement<any, any> }
>((props, ref) => <Slide direction="down" ref={ref} {...props} />);

SlideTransition.displayName = 'SlideTransition';

type SnackbarOptions = {
  message: string;
  severity?: AlertColor;
  duration?: number;
};

type SnackbarContextType = {
  showSnackbar: (options: SnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
    duration: number;
  }>({
    open: false,
    message: '',
    severity: 'info',
    duration: 3000,
  });

  const showSnackbar = useCallback(
    ({ message, severity = 'info', duration = 3000 }: SnackbarOptions) => {
      setSnackbarState({ open: true, message, severity, duration });
    },
    []
  );

  const handleClose = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={snackbarState.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          onClose={handleClose}
          severity={snackbarState.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarState.message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbarNotifier = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbarNotifier must be used within a SnackbarProvider');
  }
  return context;
};