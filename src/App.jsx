import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ToastProvider } from './components/ui/ToastProvider'
import ProtectedRoute from './components/layout/ProtectedRoute'

const ReferPage     = lazy(() => import('./pages/ReferPage'))
const ThankYouPage  = lazy(() => import('./pages/ThankYouPage'))
const LoginPage     = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading…</p>
    </div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/refer',
    element: <Suspense fallback={<PageLoader />}><ReferPage /></Suspense>,
  },
  {
    path: '/thank-you',
    element: <Suspense fallback={<PageLoader />}><ThankYouPage /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>,
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-red mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">David Padilla — State Farm</h1>
          <p className="text-gray-500 mb-6">Referral Rewards Program</p>
          <a href="/login" className="inline-block bg-brand-red text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-red-dark transition-colors text-sm">
            Staff Dashboard
          </a>
        </div>
      </div>
    ),
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <p className="text-6xl mb-4">404</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Page not found</h1>
          <a href="/" className="text-brand-red hover:underline text-sm">Go home</a>
        </div>
      </div>
    ),
  },
])

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}
