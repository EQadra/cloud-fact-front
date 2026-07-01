import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const ProtectedRoute = ({
  children,
}: Props) => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" />
  )
}

export default ProtectedRoute