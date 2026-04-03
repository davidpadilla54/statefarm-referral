import { useState } from 'react'
import DashboardSidebar from './DashboardSidebar'

const MONEY_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ctext x='8' y='42' font-size='36' fill='%2316a34a' opacity='0.07' font-family='serif' font-weight='bold'%3E%24%3C/text%3E%3C/svg%3E")`

export default function DashboardShell({ activeTab, onTabChange, contentBg = 'bg-gray-50', showMoneyPattern = false, showCustomerRed = false, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const wrapperStyle = showMoneyPattern
    ? { backgroundImage: MONEY_PATTERN, backgroundRepeat: 'repeat', backgroundColor: '#f0fdf4' }
    : showCustomerRed
    ? { backgroundColor: 'rgba(204, 0, 0, 0.28)' }
    : {}

  return (
    <div
      className={`flex min-h-screen ${showMoneyPattern || showCustomerRed ? '' : contentBg} overflow-x-hidden transition-colors duration-300`}
      style={wrapperStyle}
    >
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-800">David Padilla — State Farm</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
