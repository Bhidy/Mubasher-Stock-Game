import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import DebugErrorBoundary from './components/DebugErrorBoundary'

// Build timestamp: 2025-12-10T22:05:00 - Force cache invalidation
// Simple, reliable mount
const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <DebugErrorBoundary>
        <App />
      </DebugErrorBoundary>
    </StrictMode>
  )
}
