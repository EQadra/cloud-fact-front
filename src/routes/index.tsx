// src/routes/AppRouter.tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Login from '../views/auth/Login'
import Dashboard from '../views/app/Dashboard'
import Users from '../views/auth/Users'
import Roles from '../views/auth/Roles'
import Permissions from '../views/auth/Permissions'

// Importar componentes de Producción
import Trazabilidad from '../views/app/Produccion/Trazabilidad'


// ✅ Importar componentes de Seguridad
import AccessCarControl from '../views/app/Seguridad/AccessCarControl'
import AccessControl from '../views/app/Seguridad/AccessControl'
import ExternalView from '../views/app/Seguridad/ExternalView'  // ✅ Verificar que existe
import IncidentBook from '../views/app/Seguridad/IncidentBook'

import ProtectedRoute from './ProtectedRoute'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Roles */}
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          }
        />

        {/* Permissions */}
        <Route
          path="/permissions"
          element={
            <ProtectedRoute>
              <Permissions />
            </ProtectedRoute>
          }
        />

        {/* ============================================
            MÓDULO DE PRODUCCIÓN - TRAZABILIDAD
            ============================================ */}
        <Route
          path="/produccion/trazabilidad"
          element={
            <ProtectedRoute>
              <Trazabilidad />
            </ProtectedRoute>
          }
        />


        {/* ============================================
            MÓDULO DE SEGURIDAD
            ============================================ */}
        <Route
          path="/seguridad/access-car"
          element={
            <ProtectedRoute>
              <AccessCarControl />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seguridad/access-control"
          element={
            <ProtectedRoute>
              <AccessControl />
            </ProtectedRoute>
          }
        />

        {/* ✅ Ruta para el Visor Externo */}
        <Route
          path="/seguridad/external-view"
          element={
            <ProtectedRoute>
              <ExternalView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seguridad/incident-book"
          element={
            <ProtectedRoute>
              <IncidentBook />
            </ProtectedRoute>
          }
        />

        {/* Redirección */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter