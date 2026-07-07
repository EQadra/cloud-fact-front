// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { RolesProvider } from './context/RolesContext';
import { ProductionProvider } from './context/ProductionContext';
import { SecurityProvider } from './context/SecurityContext';
import { MedicalProvider } from './context/MedicalContext';
import { CommercialProvider } from './context/CommercialContext';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <UsersProvider>
        <RolesProvider>
          <ProductionProvider>
            <SecurityProvider>
              <MedicalProvider>
                <CommercialProvider>
                  <App />
                </CommercialProvider>
              </MedicalProvider>
            </SecurityProvider>
          </ProductionProvider>
        </RolesProvider>
      </UsersProvider>
    </AuthProvider>
  </StrictMode>
);