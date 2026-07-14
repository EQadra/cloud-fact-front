// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ===== CONTEXT PROVIDERS =====
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { RolesProvider } from './context/RolesContext';
import { PermissionsProvider } from './context/PermissionsContext';
import { ProductionProvider } from './context/ProductionContext';
import { SecurityProvider } from './context/SecurityContext'; // ✅ IMPORTAR SecurityProvider
// import { CommercialProvider } from './context/CommercialContext';

// ===== COMPONENTS =====
import { ProtectedRoute } from './components/ProtectedRoute';

// ===== AUTH PAGES =====
import Login from './views/auth/Login';
import UsersList from './views/auth/Users';
import RolesList from './views/auth/Roles';
import PermissionsList from './views/auth/Permissions';

// ===== PRODUCTION PAGES =====
import Trazabilidad from './views/app/Produccion/Trazabilidad';

// ===== SECURITY PAGES =====
// ✅ IMPORTAR LOS COMPONENTES CORRECTOS
import PedestrianAccess from './views/app/Seguridad/AccessControl';
import VehicleAccess from './views/app/Seguridad/AccessCarControl';
// Si tienes otros componentes, importarlos también
// import AccessControl from './views/app/Seguridad/AccessControl';
 import ExternalView from './views/app/Seguridad/ExternalView';
 import IncidentBook from './views/app/Seguridad/IncidentBook';

// ===== DASHBOARD =====
import Dashboards from './views/app/Dashboard';

// =============================================
// APP COMPONENT
// =============================================

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UsersProvider>
          <RolesProvider>
            <PermissionsProvider>
              <ProductionProvider>
                <SecurityProvider> {/* ✅ ENVOLVER CON SecurityProvider */}
                  <Routes>
                    {/* ✅ Ruta de Login - PÚBLICA */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* ✅ Ruta raíz - Protegida */}
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/dashboard" />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Dashboard - Protegido */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboards />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Users & Roles - Protegidos */}
                    <Route 
                      path="/users" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_USUARIOS']}>
                          <UsersList />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/roles" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_ROLES']}>
                          <RolesList />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/permissions" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_PERMISOS']}>
                          <PermissionsList />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Production - Protegidos */}
                    <Route 
                      path="/produccion" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_PRODUCCION']}>
                          <Trazabilidad />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/produccion/:id" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_PRODUCCION']}>
                          <Trazabilidad />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/produccion/:id/trazabilidad" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_PRODUCCION']}>
                          <Trazabilidad />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Security - Protegidos */}
                    {/* ✅ ACCESO PEATONAL - Usa el componente PedestrianAccess */}
                    <Route 
                      path="/seguridad/acceso-peatonal" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                          <PedestrianAccess />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ ACCESO VEHICULAR - Usa el componente VehicleAccess */}
                    <Route 
                      path="/seguridad/acceso-vehicular" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                          <VehicleAccess />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Redirigir /seguridad/acceso-control a peatonal */}
                    <Route 
                      path="/seguridad/acceso-control" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                          <PedestrianAccess />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Redirigir /seguridad/acceso-car-control a vehicular */}
                    <Route 
                      path="/seguridad/acceso-car-control" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                          <VehicleAccess />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Otros módulos de seguridad */}
                    <Route 
                      path="/seguridad/external" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                           <ExternalView />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/seguridad/incidentes" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_INCIDENTES']}>
                          <IncidentBook />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/seguridad/camaras" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_CAMARAS']}>
                          <div>Gestión de Cámaras - En construcción</div>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Medical - Protegidos */}
                    <Route 
                      path="/medical/pacientes" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_PACIENTES']}>
                          <div>Lista de Pacientes - En construcción</div>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/medical/pacientes/:id" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_PACIENTES']}>
                          <div>Detalle de Paciente - En construcción</div>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ✅ Commercial - Protegidos */}
                    <Route 
                      path="/comercial/ventas" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_VENTAS']}>
                          <div>Lista de Ventas - En construcción</div>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/comercial/productos" 
                      element={
                        <ProtectedRoute requiredPermissions={['VER_PRODUCTOS']}>
                          <div>Lista de Productos - En construcción</div>
                        </ProtectedRoute>
                      } 
                    />

                    {/* ⚠️ RUTA DE FALLBACK */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </SecurityProvider>
              </ProductionProvider>
            </PermissionsProvider>
          </RolesProvider>
        </UsersProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;