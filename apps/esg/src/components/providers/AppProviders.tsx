import React from 'react';
import { SnackbarProvider } from '@esg/hooks/utils/UseSnackBar';
import { DialogProvider } from '@esg/hooks/utils/useDialog';
import { MenuProvider } from '@esg/providers/MenuProvider';

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <MenuProvider>
            <SnackbarProvider>
                <DialogProvider>
                    {children}
                </DialogProvider>
            </SnackbarProvider>
        </MenuProvider>
    );
};

export default AppProviders;