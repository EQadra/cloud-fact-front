// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { RolesProvider } from './context/RolesContext';
import { ProductionProvider } from './context/ProductionContext';
import { SecurityProvider } from './context/SecurityContext';
import { MedicalProvider } from './context/MedicalContext';
import { CommercialProvider } from './context/CommercialContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages - Auth
import Login from './views/auth/Login';
import UsersList from './views/auth/Users';
import RolesList from './views/auth/Roles';
import PermissionsList from './views/auth/Permissions';

// Pages - Production
import PlantasList from './views/app/Produccion/PlantasList';
import PlantaDetail from './views/app/Produccion/PlantaDetail';
import Trazabilidad from './views/app/Produccion/Trazabilidad';

// Pages - Security
import AccessVehicular from './views/app/Seguridad/AccessVehicular';
import AccessPeatonal from './views/app/Seguridad/AccessPeatonal';
import IncidentBook from './views/app/Seguridad/IncidentBook';
import Cameras from './views/app/Seguridad/Cameras';

// Pages - Medical
import PatientsList from './views/app/Medical/PatientsList';
import PatientDetail from './views/app/Medical/PatientDetail';

// Pages - Commercial
import SalesList from './views/app/Comercial/SalesList';
import ProductsList from './views/app/Comercial/ProductsList';

// Unauthorized page
import Unauthorized from './views/Unauthorized';

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
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      
                      {/* Main Layout Routes */}
                      <Route path="/" element={
                        <ProtectedRoute>
                          <MainLayout />
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
                              <PlantasList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="produccion/:id" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PRODUCCION']}>
                              <PlantaDetail />
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
                              <AccessVehicular />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="seguridad/acceso-peatonal" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_ACCESO']}>
                              <AccessPeatonal />
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
                              <Cameras />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Medical */}
                        <Route 
                          path="medical/pacientes" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PACIENTES']}>
                              <PatientsList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="medical/pacientes/:id" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PACIENTES']}>
                              <PatientDetail />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Commercial */}
                        <Route 
                          path="comercial/ventas" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_VENTAS']}>
                              <SalesList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="comercial/productos" 
                          element={
                            <ProtectedRoute requiredPermissions={['VER_PRODUCTOS']}>
                              <ProductsList />
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