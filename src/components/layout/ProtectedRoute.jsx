import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Skeleton from '../ui/Skeleton'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-64 space-y-3">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
