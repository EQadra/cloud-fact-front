// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ===== CONTEXT PROVIDERS =====
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { RolesProvider } from './context/RolesContext';
import { ProductionProvider } from './context/ProductionContext';
import { SecurityProvider } from './context/SecurityContext';
import { MedicalProvider } from './context/MedicalContext';
import { CommercialProvider } from './context/CommercialContext';

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
import AccessCarControl from './views/app/Seguridad/AccessCarControl';
import AccessControl from './views/app/Seguridad/AccessControl';
import ExternalView from './views/app/Seguridad/ExternalView';
import IncidentBook from './views/app/Seguridad/IncidentBook';

// =============================================
// APP COMPONENT
// =============================================

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UsersProvider>
          <RolesProvider>
            <ProductionProvider>
              <SecurityProvider>
                <MedicalProvider>
                  <CommercialProvider>
                    <Routes>
                      {/* Auth Routes */}
                      <Route path="/login" element={<Login />} />
                      
                      {/* Main Layout Routes */}
                      <Route path="/" element={
                        <ProtectedRoute>
                          <div>Main Layout - En construcción</div>
                        </ProtectedRoute>
                      }>
                        <Route index element={<Navigate to="/dashboard" />} />
                        
                        {/* Dashboard */}
                        <Route path="dashboard" element={<div>Dashboard</div>} />
                        
                        {/* Users & Roles */}
                        <Route 
                          path="users" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_USUARIOS']}>
                              <UsersList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="roles" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_ROLES']}>
                              <RolesList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="permissions" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PERMISOS']}>
                              <PermissionsList />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Production */}
                        <Route 
                          path="produccion" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PRODUCCION']}>
                              <div>Lista de Plantas - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="produccion/:id" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PRODUCCION']}>
                              <div>Detalle de Planta - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="produccion/:id/trazabilidad" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PRODUCCION']}>
                              <Trazabilidad />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Security */}
                        <Route 
                          path="seguridad/acceso-vehicular" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                              <div>Control de Acceso Vehicular - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="seguridad/acceso-peatonal" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                              <div>Control de Acceso Peatonal - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="seguridad/acceso-control" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                              <AccessControl />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="seguridad/acceso-car-control" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                              <AccessCarControl />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="seguridad/external" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                              <ExternalView />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="seguridad/incidentes" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_INCIDENTES']}>
                              <IncidentBook />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="seguridad/camaras" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_CAMARAS']}>
                              <div>Gestión de Cámaras - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Medical */}
                        <Route 
                          path="medical/pacientes" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PACIENTES']}>
                              <div>Lista de Pacientes - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="medical/pacientes/:id" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PACIENTES']}>
                              <div>Detalle de Paciente - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Commercial */}
                        <Route 
                          path="comercial/ventas" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_VENTAS']}>
                              <div>Lista de Ventas - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="comercial/productos" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PRODUCTOS']}>
                              <div>Lista de Productos - En construcción</div>
                            </ProtectedRoute>
                          } 
                        />
                      </Route>
                    </Routes>
                  </CommercialProvider>
                </MedicalProvider>
              </SecurityProvider>
            </ProductionProvider>
          </RolesProvider>
        </UsersProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;